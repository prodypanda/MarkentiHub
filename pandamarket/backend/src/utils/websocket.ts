// @ts-ignore
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer | null = null;

export const initializeWebSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.PD_STORE_CORS || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: any) => {
    console.log('[WebSocket] Client connected:', socket.id);

    // Vendor joins their specific store room to receive private notifications
    socket.on('join_store', (storeId: string) => {
      socket.join(storeId);
      console.log(`[WebSocket] Socket ${socket.id} joined store ${storeId}`);
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Client disconnected:', socket.id);
    });
  });

  return io;
};

export const notifyVendor = (storeId: string, event: string, payload: any) => {
  if (io) {
    io.to(storeId).emit(event, payload);
    console.log(`[WebSocket] Emitted ${event} to store ${storeId}`);
  } else {
    console.warn('[WebSocket] Cannot emit, Socket.io not initialized.');
  }
};
