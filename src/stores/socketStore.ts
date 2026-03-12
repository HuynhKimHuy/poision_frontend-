import { create } from 'zustand'
import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from './useAuthStore'


interface SocketState {
	socket: Socket | null
	connectSocket: () => void
	disconnectSocket: () => void
    onlineUsers: string[]
}

const baseURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const useSocketStore = create<SocketState>((set, get) => ({
	socket: null,
    onlineUsers: [],
	connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken
        
        const exsittingSocket = get().socket
			if(exsittingSocket?.connected) return 
        const socket = io(baseURL, {
            auth: {
                token: accessToken
            },
            transports: ['websocket']
        })
        set({ socket })
        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id)
        })
        socket.on("online-users", (users: string[]) => {
            set({ onlineUsers: users })
        })
	},

	disconnectSocket: () => {
		const { socket } = get()
		if (socket) {
			socket.disconnect()
			set({ socket: null, onlineUsers: [] })
		}
	},
}))
