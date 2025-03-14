import { create } from "zustand";

import { instance } from "./../src/service/index";
import { useAuthStore } from "./useAuthStore";
import IMessage from "./../src/interface/IMessage";
import IUser from "@/interface/IUser";

type State = {
  messages: IMessage[];
  users: IUser[];
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  usersNotification: Record<string, string[]>;
  isMessageLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: IMessage) => Promise<void>;
  subscribeToMessage: () => void;
  unSubscribeFromMessage: () => void;
  setSelectedUser: (selectedUser: IUser | null) => void;
};

export const useChatStore = create<State>((set, get) => ({
  messages: [],
  users: [],
  usersNotification: {},
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await instance.get("/messages/users");

      set({ users: res.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessageLoading: true });

    try {
      const res = await instance.get(`/messages/${userId}`);
      console.log(res.data.data);
      set({ messages: res.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData: IMessage) => {
    const { selectedUser, messages } = get();

    try {
      const res = await instance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      console.log(error);
    }
  },

  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unSubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;

    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser: IUser | null) => set({ selectedUser }),
}));
