import { Skeleton } from "../ui/skeleton";

const MessageSkeleton = () => {
    // Create an array of 6 items for skeleton messages
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {skeletonMessages.map((_, idx) => (
          <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "flex flex-col items-end"}`}>
  
            <div className="chat-header mb-1">
              <Skeleton className=" h-4 w-16" />
            </div>
  
            <div className="chat-bubble bg-transparent p-0">
              <Skeleton className=" h-16 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;