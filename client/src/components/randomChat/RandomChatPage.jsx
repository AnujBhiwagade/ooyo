
import { useEffect, useRef, useState } from "react";
import socket from "../../socket/socket";
import useRandomWebRTC from "../../hooks/useRandomWebRTC";

function RandomChatPage({ playerName, onLeave }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionRef = useRef(null);

  const [status, setStatus] = useState("connecting");
  const [partnerName, setPartnerName] = useState("Stranger");
  const [partnerId, setPartnerId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatError, setChatError] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const {
    localStream,
    remoteStream,
    cameraError,
    connectionState,
  } = useRandomWebRTC(sessionId, partnerId);

  const videoConnected =
    status === "matched" && connectionState === "connected";

  // Attach local camera stream.
  useEffect(() => {
    const video = localVideoRef.current;
    if (!video) return;

    video.srcObject = localStream || null;
    if (localStream) video.play().catch(() => {});

    return () => {
      if (video.srcObject === localStream) video.srcObject = null;
    };
  }, [localStream]);

  // Attach stranger's video stream.
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video) return;

    video.srcObject = remoteStream || null;
    if (remoteStream) video.play().catch(() => {});

    return () => {
      if (video.srcObject === remoteStream) video.srcObject = null;
    };
  }, [remoteStream]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Random matching and chat events.
  useEffect(() => {
    let active = true;

    const joinQueue = () => {
      if (!active) return;
      setStatus("waiting");
      socket.emit("random-chat-join", { name: playerName.trim() });
    };

    const handleWaiting = () => {
      if (!active) return;

      sessionRef.current = null;
      setSessionId(null);
      setPartnerId(null);
      setPartnerName("Stranger");
      setStatus("waiting");
      setChatError("");
      setMessages([
        {
          id: `${Date.now()}-waiting`,
          type: "system",
          text: "Looking for someone new...",
        },
      ]);
    };

    const handleMatched = (data) => {
      if (!active || !data?.sessionId || !data?.partnerId) return;

      sessionRef.current = data.sessionId;
      setSessionId(data.sessionId);
      setPartnerId(data.partnerId);
      setPartnerName(data.partnerName || "Stranger");
      setStatus("matched");
      setChatError("");
      setMessageText("");
      setMessages([
        {
          id: `${Date.now()}-welcome`,
          type: "system",
          text: `You're connected with ${
            data.partnerName || "a stranger"
          }. Say hello!`,
        },
      ]);
    };

    const handlePartnerLeft = () => {
      if (!active) return;

      sessionRef.current = null;
      setSessionId(null);
      setPartnerId(null);
      setPartnerName("Stranger");
      setStatus("waiting");
      setMessageText("");
      setChatError("");
      setMessages([
        {
          id: `${Date.now()}-left`,
          type: "system",
          text: "The stranger left. Looking for someone new...",
        },
      ]);

      socket.emit("random-chat-join", { name: playerName.trim() });
    };

    const handleIncomingMessage = (data) => {
      if (
        !active ||
        !data ||
        data.sessionId !== sessionRef.current ||
        typeof data.text !== "string"
      ) {
        return;
      }

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          type: "stranger",
          text: data.text,
        },
      ]);
    };

    const handleError = (data) => {
      if (!active) return;
      setChatError(data?.message || "Something went wrong. Please try again.");
    };

    socket.on("random-chat-waiting", handleWaiting);
    socket.on("random-chat-matched", handleMatched);
    socket.on("random-chat-partner-left", handlePartnerLeft);
    socket.on("random-chat-message", handleIncomingMessage);
    socket.on("random-chat-error", handleError);

    if (socket.connected) {
      joinQueue();
    } else {
      socket.connect();
      socket.once("connect", joinQueue);
    }

    return () => {
      active = false;
      socket.off("random-chat-waiting", handleWaiting);
      socket.off("random-chat-matched", handleMatched);
      socket.off("random-chat-partner-left", handlePartnerLeft);
      socket.off("random-chat-message", handleIncomingMessage);
      socket.off("random-chat-error", handleError);
      socket.off("connect", joinQueue);
      socket.emit("random-chat-leave");
    };
  }, [playerName]);

  const handleSendMessage = (event) => {
    event.preventDefault();

    const text = messageText.trim();
    if (!text || status !== "matched" || !sessionId) return;

    if (text.length > 1000) {
      setChatError("Messages must be 1,000 characters or fewer.");
      return;
    }

    socket.emit("random-chat-message", { sessionId, text });

    setMessages((previous) => [
      ...previous,
      { id: `${Date.now()}-${Math.random()}`, type: "you", text },
    ]);

    setMessageText("");
    setChatError("");
    inputRef.current?.focus();
  };

  const handleNext = () => {
    if (status === "connecting") return;

    sessionRef.current = null;
    setSessionId(null);
    setPartnerId(null);
    setPartnerName("Stranger");
    setStatus("waiting");
    setMessageText("");
    setChatError("");
    setMessages([
      {
        id: `${Date.now()}-next`,
        type: "system",
        text: "Finding your next conversation...",
      },
    ]);

    socket.emit("random-chat-next");
  };

  const handleLeave = () => {
    socket.emit("random-chat-leave");
    onLeave();
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-black text-white">
      <div className="mx-auto flex h-full max-w-none flex-col px-2 sm:px-4">
        {/* Compact header */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10">
          <button
            onClick={handleLeave}
            aria-label="Return to Ooyo home"
            className="text-xl font-black tracking-tight"
          >
            ooyo<span className="text-purple-400">.</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span
              className={`h-2 w-2 rounded-full ${
                videoConnected
                  ? "bg-green-400"
                  : status === "matched"
                    ? "animate-pulse bg-yellow-400"
                    : "animate-pulse bg-purple-400"
              }`}
            />
            {videoConnected
              ? "Connected"
              : status === "matched"
                ? "Match found"
                : status === "waiting"
                  ? "Finding stranger"
                  : "Connecting"}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileChat((visible) => !visible)}
              aria-pressed={showMobileChat}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 lg:hidden"
            >
              {showMobileChat ? "Video" : "Chat"}
            </button>
            <button
              onClick={handleLeave}
              className="text-xs text-gray-400 transition hover:text-white"
            >
              Exit
            </button>
          </div>
        </header>

        {/* Mobile/tablet: switch between large videos and chat. Desktop: videos + chat side by side. */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 py-2 sm:gap-3 sm:py-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Video tiles stay mounted only while the video view is active on small screens. */}
          <section className={`${showMobileChat ? "hidden lg:flex" : "flex"} min-h-0 flex-col gap-2 sm:gap-3`}>

            {/* Stranger video */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#111111]">
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-400/30 bg-purple-400/10 text-xl text-purple-300">
                    {status === "matched" ? "◉" : "?"}
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    {status === "matched"
                      ? connectionState === "failed"
                        ? "Video connection failed"
                        : "Connecting video..."
                      : status === "connecting"
                        ? "Connecting..."
                        : "Looking for a stranger"}
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
                    {status === "matched"
                      ? "Waiting for the stranger's camera."
                      : "Your next conversation could be just around the corner."}
                  </p>
                </div>
              )}

              <span className="absolute left-2 top-2 rounded-md bg-black/75 px-2.5 py-1.5 text-xs">
                {status === "matched" ? partnerName : "Stranger"}
              </span>

              <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-1 text-[11px] text-gray-300">
                {videoConnected ? "Connected" : "Stranger"}
              </span>
            </div>

            {/* Your video */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#111111]">
              {localStream && !cameraError ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-xl text-gray-400">
                    ◉
                  </div>
                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    {cameraError || "Starting your camera..."}
                  </p>
                </div>
              )}

              <span className="absolute left-2 top-2 rounded-md bg-black/75 px-2.5 py-1.5 text-xs">
                You · {playerName}
              </span>

              <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-1 text-[11px] text-gray-300">
                Camera on
              </span>
            </div>
          </section>

          {/* Right: chat */}
          <aside className={`${showMobileChat ? "flex" : "hidden lg:flex"} min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#090909]`}>
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h1 className="text-sm font-semibold">Chat</h1>
                <p className="mt-0.5 text-xs text-gray-500">
                  {status === "matched"
                    ? `Talking with ${partnerName}`
                    : "Meet someone new"}
                </p>
              </div>

              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-gray-400">
                {status === "matched" ? "Matched" : "Waiting"}
              </span>
            </div>

            {/* Messages */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 sm:p-4">
              {messages.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-lg text-purple-300">
                    ↗
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-300">
                    Say hello to someone new.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Your messages will appear here.
                  </p>
                </div>
              )}

              {messages.map((message) => {
                if (message.type === "system") {
                  return (
                    <div
                      key={message.id}
                      className="max-w-[90%] self-center rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-center text-xs leading-5 text-gray-400"
                    >
                      {message.text}
                    </div>
                  );
                }

                const isYou = message.type === "you";

                return (
                  <div
                    key={message.id}
                    className={`max-w-[85%] break-words rounded-xl px-3 py-2.5 text-sm leading-5 ${
                      isYou
                        ? "self-end rounded-br-sm bg-white text-black"
                        : "self-start rounded-bl-sm bg-white/[0.08] text-gray-100"
                    }`}
                  >
                    <p
                      className={`mb-1 text-[10px] ${
                        isYou ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {isYou ? "You" : partnerName}
                    </p>
                    {message.text}
                  </div>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {chatError && (
              <p role="status" className="shrink-0 px-3 pb-2 text-xs text-red-300">
                {chatError}
              </p>
            )}

            {/* Message composer */}
            <form
              onSubmit={handleSendMessage}
              className="shrink-0 border-t border-white/10 p-3"
            >
              <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2 focus-within:border-purple-400/50">
                <textarea
                  ref={inputRef}
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  maxLength={1000}
                  rows={2}
                  placeholder={
                    status === "matched"
                      ? "Type a message..."
                      : "Waiting for a stranger..."
                  }
                  disabled={status !== "matched"}
                  className="min-h-10 max-h-24 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-gray-600 disabled:cursor-not-allowed"
                />

                <button
                  type="submit"
                  disabled={status !== "matched" || !messageText.trim()}
                  className="rounded-md bg-white px-3 py-2 text-xs font-bold text-black transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Send
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[10px] text-gray-600">
                Enter to send · Shift + Enter for a new line
              </p>
            </form>

            {/* Both actions in one horizontal row */}
            <div className="hidden shrink-0 grid-cols-2 gap-2 border-t border-white/10 p-3 lg:grid">
              <button
                type="button"
                onClick={handleNext}
                disabled={status === "connecting"}
                className="min-w-0 rounded-lg bg-purple-400 px-3 py-2.5 text-sm font-semibold text-black transition hover:bg-purple-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "matched" ? "Next stranger →" : "Find stranger →"}
              </button>

              <button
                type="button"
                onClick={handleLeave}
                className="min-w-0 rounded-lg border border-white/15 px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
              >
                Leave chat
              </button>
            </div>
          </aside>
        </div>

        {/* Large, thumb-friendly controls remain visible on phone and tablet portrait. */}
        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/10 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
          <button
            type="button"
            onClick={handleNext}
            disabled={status === "connecting"}
            className="min-h-12 min-w-0 rounded-xl bg-purple-400 px-3 py-3 text-sm font-bold text-black transition hover:bg-purple-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "matched" ? "Skip →" : "Find stranger →"}
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="min-h-12 min-w-0 rounded-xl border border-white/20 px-3 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/[0.06]"
          >
            Leave chat
          </button>
        </div>
      </div>
    </main>
  );
}

export default RandomChatPage;
