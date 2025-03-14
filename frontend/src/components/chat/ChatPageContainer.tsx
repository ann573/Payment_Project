import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import MessageSkeleton from "../skeleton/MessageSkeleton";
import { useAuthStore } from "./../../../store/useAuthStore";
import { useChatStore } from "./../../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatPageContainer = () => {
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscribeToMessage,
    unSubscribeFromMessage,
  } = useChatStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);
    subscribeToMessage();

    return () => unSubscribeFromMessage();
  }, [getMessages, selectedUser, unSubscribeFromMessage, subscribeToMessage]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function formatMessageTime(date: string) {
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  if (isMessageLoading) return <MessageSkeleton />;
  return (
    <>
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages &&
            messages.map((message) => (
              <div
                key={message?._id}
                className={`chat ${
                  message.senderId === authUser?._id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble bg-white text-black shadow-lg flex flex-col">
                  {message.image && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                          onClick={() => setSelectedImage(message.image)}
                        />
                      </DialogTrigger>
                      <DialogContent className="p-0">
                        <div className="h-4/5">
                          {selectedImage && (
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="w-h-auto rounded-lg"
                            />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
        </div>
        <MessageInput />
      </div>
    </>
  );
};

export default ChatPageContainer;
