import IUser from "@/interface/IUser";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8888" : "/v1/api";
// const BASE_URL = "https://nodejs-sapo.onrender.com";

type State = {
  authUser: IUser | null;
  isLoggingIn: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  login: (data: IUser) => Promise<void>;
  logout: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

export const useAuthStore = create<State>((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      localStorage.setItem("authUser", JSON.stringify(data));
      set({ authUser: data });

      get().connectSocket();
    } catch (error) {
      console.log(error);

      toast.error("Có lỗi xảy ra");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.disconnect();
      set({ socket: null }); // Cập nhật state sau khi ngắt kết nối
    }
  },
}));
