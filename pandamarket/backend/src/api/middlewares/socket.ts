import { Server as SocketServer } from 'socket.io';

let io: SocketServer;

export function initSocketServer(server: any) {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.PD_STORE_CORS?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket] Client connected:', socket.id);
    
    // Vendor authenticates with their store ID to join a private notification room
    socket.on('join_store', (data: { storeId: string, token: string }) => {
      // Security: In production, verify the JWT token here before allowing join
      const storeId = data.storeId;
      socket.join(`store_${storeId}`);
      console.log(`[Socket] Vendor joined notification room: store_${storeId}`);
      
      socket.emit('connected', { message: `Joined room for store ${storeId}` });
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getSocketIO() {
  if (!io) {
    console.warn('[Socket] Warning: IO instance requested before initialization.');
  }
  return io;
}
