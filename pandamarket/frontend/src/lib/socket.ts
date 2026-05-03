import { io } from 'socket.io-client';

// The URL of our Medusa Backend
const URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';

// We initialize the socket but keep autoConnect false so we can connect
// only when the vendor is fully authenticated and inside the dashboard.
export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});
