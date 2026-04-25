import { io, Socket } from "socket.io-client";
import { tokens } from "./client";

const SOCKET_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api$/, "");

let socket: Socket | null = null;

export function getSocket(): Socket {
  // Reuse the cached socket whether it's currently connected OR still
  // mid-handshake (active === true means io() has been called and not
  // yet disconnected). Prevents creating a second socket while the
  // first is still negotiating.
  if (socket && (socket.connected || socket.active)) return socket;

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
