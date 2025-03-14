import { User } from "lucide-react";
import { useEffect, useState } from "react";
import imageUser from "../../assets/pictures/avtUser.png";
import SideBarSkeleton from "../skeleton/SideBarSkeleton";
import { useChatStore } from "./../../../store/useChatStore";
import { useAuthStore } from "./../../../store/useAuthStore";
const SideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  if (isUsersLoading) return <SideBarSkeleton />;
  return (
    <>
      <aside className="h-full lg:w-72 border-r flex flex-col transition-all duration-200">
        <div className="border-b w-full p-5">
          <div className="flex items-center gap-2">
            <User className="size-6" />
            <span className="font-medium hidden lg:block">Liên hệ</span>
          </div>
          {/* ===================================== */}

          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-info checkbox-sm"
              />
              <span className="md:text-sm text-xs">Đang hoạt động</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>
        <div className="overflow-y-auto w-full pb-3">
          {filteredUsers?.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:shadow-lg transition-colors
              ${selectedUser?._id === user._id ? "bg-slate-100 " : ""}
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={imageUser}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full "
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
