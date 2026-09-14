import { useEffect, useRef, useState } from "react";
import socket from "../../socket/socket";

const emptyPrompts = [
  {
    title: "Nobody said anything yet.",
    text: "Be the problem.",
  },
  {
    title: "It's getting awkward.",
    text: "Ask someone something weird.",
  },
  {
    title: "You came here voluntarily.",
    text: "Might as well say hi.",
  },
  {
    title: "Four strangers.",
    text: "Someone has to break the silence.",
  },
  {
    title: "This is your sign.",
    text: "Say something stupid.",
  },
];

function ChatPanel() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [promptIndex, setPromptIndex] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ============================ */
  /* RECEIVE MESSAGES */
  /* ============================ */

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, []);

  /* ============================ */
  /* AUTO SCROLL */
  /* ============================ */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ============================ */
  /* ROTATE EMPTY PROMPT */
  /* ============================ */

  useEffect(() => {
    if (messages.length > 0) return;

    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % emptyPrompts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  /* ============================ */
  /* SEND MESSAGE */
  /* ============================ */

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      message: message.trim(),
    });

    setMessage("");
  };

  /* ============================ */
  /* EMPTY STATE ACTION */
  /* ============================ */

  const handlePromptClick = () => {
    inputRef.current?.focus();
  };

  const currentPrompt = emptyPrompts[promptIndex];

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ============================ */}
      {/* HEADER */}
      {/* ============================ */}

      <div className="px-3 py-2 border-b border-white/20 flex items-center justify-between shrink-0">
        <h2 className="text-xs font-semibold">
          💬 Circle Chat
        </h2>

        {messages.length > 0 && (
          <span className="text-[9px] text-gray-600 uppercase tracking-wider">
            {messages.length}
          </span>
        )}
      </div>

      {/* ============================ */}
      {/* CHAT AREA */}
      {/* ============================ */}

      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2 min-h-0">

        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center px-4">
            <button
              onClick={handlePromptClick}
              className="
                text-center
                group
                outline-none
              "
            >
              <div
                key={promptIndex}
                className="
                  animate-[fadeIn_0.5s_ease-out]
                "
              >
                <p className="text-xs text-gray-500">
                  {currentPrompt.title}
                </p>

                <p className="
                  mt-2
                  text-white
                  text-sm
                  font-semibold
                  group-hover:text-gray-300
                  transition
                ">
                  {currentPrompt.text}
                </p>

                <p className="
                  mt-5
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-gray-700
                  group-hover:text-gray-400
                  transition
                ">
                  say something →
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-2">

            {messages.map((msg, index) => {
              const isOwnMessage =
                msg.playerId === socket.id;

              return (
                <div
                  key={`${msg.playerId}-${index}`}
                  className={`flex ${
                    isOwnMessage
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-[80%] px-2.5 py-1.5">

                    {!isOwnMessage && (
                      <div className="text-[10px] text-white mb-0.5">
                        {msg.playerName}
                      </div>
                    )}

                    <p
                      className={`text-xs break-words ${
                        isOwnMessage
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {msg.message}
                    </p>

                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        )}

      </div>

      {/* ============================ */}
      {/* INPUT */}
      {/* ============================ */}

      <div className="p-2 border-t border-white/20 shrink-0">

        <div className="flex gap-2">

          <input
            ref={inputRef}
            type="text"
            placeholder="Say something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="
              flex-1
              bg-gray-800/60
              rounded-lg
              px-3
              py-1.5
              text-xs
              outline-none
              focus:ring-1
              focus:ring-[#4C1D95]
            "
          />

          <button
            onClick={handleSend}
            className="
              bg-white
              text-black
              hover:bg-gray-200
              transition
              px-4
              rounded-lg
              text-sm
            "
          >
            ➤
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatPanel;