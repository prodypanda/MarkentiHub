import { Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

import { createServiceLogger } from './logger';

const logger = createServiceLogger('WebSocket');

let io: SocketIOServer | null = null;

interface SocketAuthPayload {
  storeId: string;
  token: string;
}

interface PdSocketJwtPayload {
  store_id: string;
}

function getJwtSecret(): string {
  const secret = process.env.PD_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('PD_JWT_SECRET must be set (>= 16 chars)');
  }
  return secret;
}

function getCorsOrigins(): string[] {
  const origins = process.env.PD_STORE_CORS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (origins?.length) return origins;
  if (process.env.PD_NODE_ENV === 'production') {
    throw new Error('PD_STORE_CORS must be set for WebSocket CORS in production');
  }
  return ['http://localhost:3000'];
}

function isSocketAuthPayload(data: unknown): data is SocketAuthPayload {
  if (!data || typeof data !== 'object') {
    return false;
  }
  const payload = data as Record<string, unknown>;
  return typeof payload.storeId === 'string' && typeof payload.token === 'string';
}

function isSocketJwtPayload(data: unknown): data is PdSocketJwtPayload {
  if (!data || typeof data !== 'object') {
    return false;
  }
  const payload = data as Record<string, unknown>;
  return typeof payload.store_id === 'string' && payload.store_id.length > 0;
}

export const initializeWebSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: getCorsOrigins(),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info({ socket_id: socket.id }, 'Client connected');

    // Vendor joins their specific store room to receive private notifications
    socket.on('join_store', (data: unknown) => {
      if (!isSocketAuthPayload(data)) {
        logger.warn({ socket_id: socket.id }, 'Invalid join_store payload');
        socket.emit('error', { code: 'PD_AUTH_TOKEN_INVALID', message: 'Invalid socket auth payload' });
        return;
      }

      try {
        const decoded = jwt.verify(data.token, getJwtSecret());
        if (!isSocketJwtPayload(decoded)) {
          logger.warn({ socket_id: socket.id, store_id: data.storeId }, 'Invalid socket token payload');
          socket.emit('error', { code: 'PD_AUTH_TOKEN_INVALID', message: 'Invalid socket token' });
          return;
        }
        if (decoded.store_id !== data.storeId) {
          logger.warn({ socket_id: socket.id, store_id: data.storeId }, 'Socket store mismatch');
          socket.emit('error', { code: 'PD_PERM_NOT_OWNER', message: 'Invalid store room' });
          return;
        }
        socket.join(`store_${data.storeId}`);
        logger.info({ socket_id: socket.id, store_id: data.storeId }, 'Socket joined store room');
      } catch (err) {
        logger.warn({ err, socket_id: socket.id }, 'Socket token verification failed');
        socket.emit('error', { code: 'PD_AUTH_TOKEN_INVALID', message: 'Invalid socket token' });
      }
    });

    socket.on('disconnect', () => {
      logger.info({ socket_id: socket.id }, 'Client disconnected');
    });
  });

  return io;
};

export const notifyVendor = (storeId: string, event: string, payload: unknown) => {
  if (io) {
    io.to(`store_${storeId}`).emit(event, payload);
    logger.info({ store_id: storeId, event }, 'Vendor WebSocket event emitted');
  } else {
    logger.warn({ store_id: storeId, event }, 'Cannot emit, Socket.io not initialized');
  }
};
