function Notification({ notification }) {
  if (!notification) {
    return null;
  }

  const isWarning =
    notification.type === "warning";

  return (
    <div
      className={`
        fixed
        top-5
        right-5
        z-[100]
        w-[320px]
        px-5
        py-4
        rounded-2xl
        shadow-2xl
        border
        backdrop-blur-xl
        text-white
        ${
          isWarning
            ? "bg-yellow-950/90 border-yellow-700/50"
            : "bg-red-950/90 border-red-700/50"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">
          {isWarning ? "⚠️" : "🚨"}
        </div>

        <div>
          <div className="font-semibold text-sm">
            {isWarning
              ? "Warning"
              : "Removed from Room"}
          </div>

          <div className="text-xs text-gray-300 mt-1">
            {notification.message}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;