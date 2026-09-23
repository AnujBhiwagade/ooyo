import FloatingReaction from "../reactions/FloatingReaction";
import { useEffect, useState } from "react";
import socket from "../../socket/socket";
import ReactionBar from "../reactions/ReactionBar";
import VideoGrid from "../player/VideoGrid";
import GamePanel from "../game/GamePanel";
import ChatPanel from "../chat/ChatPanel";
import BottomControls from "../controls/BottomControls";

function MainLayout({ playerCount, roomData, readyData, gameState }) {
  const [reactions, setReactions] = useState([]);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    const handleReaction = ({ emoji }) => {
      setReactions((prev) => [...prev, emoji]);
    };

    socket.on("receive-reaction", handleReaction);

    return () => {
      socket.off("receive-reaction", handleReaction);
    };
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* ============================ */}
      {/* MOBILE HEADER */}
      {/* ============================ */}

      <div
        className="
          md:hidden
          h-12
          min-h-12
          mx-2
          mt-2
          mb-0
          px-3
          rounded-2xl
          border
          border-white/20
          bg-[#050505]
          flex
          items-center
          justify-between
        "
      >
        <img
          src="/logo.png"
          alt="ooyo"
          className="h-8 w-auto object-contain"
        />

        <div className="text-xs text-gray-400 whitespace-nowrap">
          Live Players: {playerCount ?? 0}
        </div>
      </div>

      {/* ============================ */}
      {/* MAIN CONTENT */}
      {/* ============================ */}

      <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">

        {/* LEFT REACTIONS - DESKTOP ONLY */}
        <div className="hidden md:flex w-16 shrink-0 m-2 mr-0 rounded-2xl border border-white/20 overflow-hidden bg-[#050505]">
          <ReactionBar />
        </div>

        {/* VIDEO AREA */}
        <div
          className="
            flex-1
            min-h-0
            min-w-0
            flex
            flex-col
            m-2
            rounded-2xl
            border
            border-white/20
            overflow-hidden
            bg-[#050505]
          "
        >
          {reactions.map((emoji, index) => (
            <FloatingReaction
              key={`${emoji}-${index}`}
              emoji={emoji}
              onFinish={() => {
                setReactions((prev) =>
                  prev.filter((_, i) => i !== index),
                );
              }}
            />
          ))}

          <VideoGrid
            roomData={roomData}
            gameState={gameState}
            readyData={readyData}
          />
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            w-full
            md:w-[340px]
            md:shrink-0
            flex
            flex-col
            min-h-0
            overflow-hidden
            bg-[#050505]
            md:bg-transparent
          "
        >
          {/* GAME SECTION */}
<div
  className="
    h-[250px]
    min-h-[250px]
    mt-0
    mx-2
    mb-2

    md:h-[260px]
    md:min-h-[260px]
    md:mt-2
    md:ml-0
    md:mr-2

    rounded-2xl
    border
    border-white/20
    overflow-hidden
    bg-black/20
    shrink-0
  "
>
  <GamePanel
    roomData={roomData}
    readyData={readyData}
    gameState={gameState}
  />
</div>

          {/* CHAT - DESKTOP ONLY */}
          <div
            className="
              hidden
              md:block
              flex-1
              min-h-0
              overflow-hidden
              mr-2
              mb-2
              rounded-2xl
              border
              border-white/20
              bg-[#050505]
            "
          >
            <ChatPanel key={roomData?.roomId} />
          </div>
        </div>
      </div>

      {/* ============================ */}
      {/* BOTTOM CONTROLS */}
      {/* ============================ */}

      <div
        className="
          h-14
          min-h-14
          mx-2
          mb-2
          mt-0
          rounded-2xl
          border
          border-white/20
          overflow-hidden
          bg-black/20
          shrink-0
        "
      >
        <BottomControls
          roomData={roomData}
          gameState={gameState}
          playerCount={playerCount}
          onChatClick={() => setShowMobileChat(true)}
        />
      </div>

      {/* ============================ */}
      {/* MOBILE CHAT DRAWER */}
      {/* ============================ */}

      {showMobileChat && (
        <div className="md:hidden fixed inset-0 z-[90]">

          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setShowMobileChat(false)}
            className="
              absolute
              inset-0
              bg-black/60
              backdrop-blur-[2px]
            "
          />

          {/* CHAT PANEL */}
          <div
            className="
              absolute
              top-0
              right-0
              h-full
              w-[88vw]
              max-w-[380px]
              bg-[#050505]
              border-l
              border-white/20
              shadow-2xl
            "
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setShowMobileChat(false)}
              aria-label="Close chat"
              className="
                absolute
                top-2
                right-2
                z-20
                w-7
                h-7
                rounded-full
                bg-white/10
                text-gray-300
                flex
                items-center
                justify-center
                text-lg
                hover:bg-white/20
                hover:text-white
                transition
              "
            >
              ×
            </button>

            <ChatPanel key={roomData?.roomId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;