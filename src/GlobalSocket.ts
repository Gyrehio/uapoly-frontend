import { Socket, io } from "socket.io-client";

/**
 * A global socket instance. Null if not connected.
 */
let socket: Socket | null = null;

/**
 * Returns a socket instance. Connects to the server if not already connected.
 * @returns A socket instance.
 */
export function getSocket() {
    if(!socket) {
        socket = io('', {
            auth: {
                token: localStorage.getItem('token'),
            },
        });
    }

    return socket;
}