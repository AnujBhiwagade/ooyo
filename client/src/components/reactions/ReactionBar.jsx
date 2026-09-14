import socket from "../../socket/socket";

function ReactionBar() {
  const reactions = [
    "😂",
    "🔥",
    "💀",
    "👏",
    "😱",
    "❤️",
    "🤣",
    "😍",
    "😭",
    "🤯",
    "😎",
    "🙌",
    "🎉",
    "😡",
    "🤔",
    "👀",
    "💯",
    "⭐",
    "🥳",
    "😈",
  ];

  return (
    <div className="h-full w-full flex justify-center overflow-y-auto scrollbar-hide">
      <div className="flex flex-col items-center gap-4 py-4">
        {reactions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => socket.emit("send-reaction", { emoji })}
            className="
    text-xl
    p-1
    rounded-xl
    hover:scale-125
    active:scale-95
    transition-all duration-200
    flex-shrink-0
  "
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ReactionBar;
