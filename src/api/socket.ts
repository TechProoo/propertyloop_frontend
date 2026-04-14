import { io, Socket } from "socket.io-client";
import { tokens } from "./client";

const SOCKET_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api$/, "");

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket?.connected) return socket;

  const token = tokens.getAccess();
  socket = io(`${SOCKET_URL}/chat`, {
    auth: { token },
    query: { token: token || "" },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
