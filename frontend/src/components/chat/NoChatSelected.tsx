const NoChatSelected = () => {
  return (
    <>
      <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-white">
        <div className="text-center space-y-6">
          {/* Icon Display */}
          <div className="flex justify-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center animate-bounce">
                <div className="h-fit">
                  <i className="ri-message-2-line h-fit"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-2xl font-bold">Bạn không có tin nhắn nào</h2>
          <p>Chọn một người bên trái để nhắn tin </p>
        </div>
      </div>
    </>
  );
};

export default NoChatSelected;
