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

  /*
   * Controls when the selected player is revealed
   * in the game status panel.
   */
  /*
   * Reset the bottle state whenever a new phase starts.
   */

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
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Reactions */}
        <div className="hidden md:flex w-16 m-2 mr-0 rounded-2xl border border-white/20 overflow-hidden bg-[#050505]">
          <ReactionBar />
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col m-2 rounded-2xl border border-white/20 overflow-hidden bg-[#050505]">
          {reactions.map((emoji, index) => (
            <FloatingReaction
              key={`${emoji}-${index}`}
              emoji={emoji}
              onFinish={() => {
                setReactions((prev) => prev.filter((_, i) => i !== index));
              }}
            />
          ))}
          <VideoGrid
            roomData={roomData}
            gameState={gameState}
            readyData={readyData}
          />
        </div>

        {/* Right Side */}
        <div
          className="
            w-[340px]
            border-white/20
            flex
            flex-col
            overflow-hidden
            bg-[#050505]
            backdrop-blur-xl
          "
        >
          {/* GAME SECTION */}
          <div
            className="
              h-[260px]
              min-h-[260px]
              mt-2
              mb-2
              mr-2
              ml-0
              rounded-2xl
              border
              border-white/20
              overflow-hidden
              bg-black/20
            "
          >
            <GamePanel
              roomData={roomData}
              readyData={readyData}
              gameState={gameState}
            />
          </div>

          {/* CHAT SECTION */}
          <div
            className="
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

      {/* Bottom Controls */}
      <div className="h-14 m-2 mt-0 rounded-2xl border border-white/20 overflow-hidden bg-black/20">
        <BottomControls
          roomData={roomData}
          gameState={gameState}
          playerCount={playerCount}
        />
      </div>
    </div>
  );
}

export default MainLayout;
