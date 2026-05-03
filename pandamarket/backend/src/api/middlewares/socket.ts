import { Server as SocketServer } from 'socket.io';
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

import { createServiceLogger } from '../../utils/logger';

const logger = createServiceLogger('SocketMiddleware');

let io: SocketServer | null = null;

interface SocketJoinPayload {
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
    throw new Error('PD_STORE_CORS must be set for Socket.io CORS in production');
  }
  return ['http://localhost:3000'];
}

function isJoinPayload(data: unknown): data is SocketJoinPayload {
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

export function initSocketServer(server: HttpServer) {
  io = new SocketServer(server, {
    cors: {
      origin: getCorsOrigins(),
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info({ socket_id: socket.id }, 'Client connected');
    
    // Vendor authenticates with their store ID to join a private notification room
    socket.on('join_store', (data: unknown) => {
      if (!isJoinPayload(data)) {
        logger.warn({ socket_id: socket.id }, 'Invalid join_store payload');
        socket.emit('error', { code: 'PD_AUTH_TOKEN_INVALID', message: 'Invalid socket auth payload' });
        return;
      }

      const storeId = data.storeId;
      try {
        const decoded = jwt.verify(data.token, getJwtSecret());
        if (!isSocketJwtPayload(decoded)) {
          logger.warn({ socket_id: socket.id, store_id: storeId }, 'Invalid socket token payload');
          socket.emit('error', { code: 'PD_AUTH_TOKEN_INVALID', message: 'Invalid socket token' });
          return;
        }
        if (decoded.store_id !== storeId) {
          logger.warn({ socket_id: socket.id, store_id: storeId }, 'Socket store mismatch');
          socket.emit('error', { code: 'PD_PERM_NOT_OWNER', message: 'Invalid store room' });
          return;
        }
        socket.join(`store_${storeId}`);
        logger.info({ socket_id: socket.id, store_id: storeId }, 'Vendor joined notification room');
      } catch (err) {
        logger.warn({ err, socket_id: socket.id }, 'Socket token verification failed');
        socket.emit('error', { code: 'PD_AUTH_TOKEN_INVALID', message: 'Invalid socket token' });
        return;
      }
      
      socket.emit('connected', { message: `Joined room for store ${storeId}` });
    });

    socket.on('disconnect', () => {
      logger.info({ socket_id: socket.id }, 'Client disconnected');
    });
  });

  return io;
}

export function getSocketIO() {
  if (!io) {
    logger.warn({}, 'IO instance requested before initialization');
  }
  return io;
}
