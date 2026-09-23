import { useEffect, useState } from "react";
import socket from "../../socket/socket";

function BottomControls({
  roomData,
  gameState,
  playerCount,
  onChatClick,
}) {
  const [showConcern, setShowConcern] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [reportedPlayerIds, setReportedPlayerIds] = useState([]);

  useEffect(() => {
    const handleReportStatus = ({ reportedPlayerIds }) => {
      setReportedPlayerIds(reportedPlayerIds || []);
    };

    socket.on("report-status", handleReportStatus);

    return () => {
      socket.off("report-status", handleReportStatus);
    };
  }, []);

  const currentPlayer = gameState?.players?.find(
    (player) => player.id === socket.id,
  );

  const isReady = currentPlayer?.ready ?? false;

  // All players except yourself
  const otherPlayers =
    roomData?.players?.filter((player) => player.id !== socket.id) ?? [];

  console.log("BOTTOM CONTROL GAME STATE:", gameState);
  console.log("SOCKET ID:", socket.id);
  console.log("CURRENT PLAYER:", currentPlayer);
  console.log("IS READY:", isReady);

  // ============================
  // READY / UNREADY
  // ============================

  const handleReady = () => {
    console.log("READY CLICKED");

    if (!roomData?.roomId) {
      console.log("❌ NO ROOM ID");
      return;
    }

    socket.emit("player-ready", {
      roomId: roomData.roomId,
    });

    console.log("✅ player-ready emitted");
  };

  // ============================
  // MOVE ROOM
  // ============================

  const handleMoveRoom = () => {
    console.log("🚪 MOVE ROOM CLICKED");
    console.log("CURRENT ROOM:", roomData?.roomId);

    if (!roomData?.roomId) {
      console.log("❌ NO ROOM ID");
      return;
    }

    socket.emit("move-room", {
      roomId: roomData.roomId,
    });

    console.log("✅ move-room emitted");
  };

  // ============================
  // LEAVE GAME
  // ============================

  const handleLeaveGame = () => {
    console.log("🚪 LEAVE GAME CLICKED");

    if (!roomData?.roomId) {
      console.log("❌ NO ROOM ID");
      return;
    }

    setShowLeaveConfirm(true);
  };

  const handleConfirmLeave = () => {
    console.log("🚪 LEAVE GAME CONFIRMED");

    if (!roomData?.roomId) {
      console.log("❌ NO ROOM ID");
      setShowLeaveConfirm(false);
      return;
    }

    socket.emit("leave-game", {
      roomId: roomData.roomId,
    });

    console.log("✅ leave-game emitted");

    setShowLeaveConfirm(false);
  };

  const handleCancelLeave = () => {
    console.log("❌ LEAVE GAME CANCELLED");
    setShowLeaveConfirm(false);
  };

  // ============================
  // CONCERN
  // ============================

  const handleConcern = () => {
    console.log("⚠ CONCERN CLICKED");

    setSelectedPlayerId(null);
    setShowConcern(true);
  };

  const handleCloseConcern = () => {
    setShowConcern(false);
    setSelectedPlayerId(null);
  };

  const handleReport = () => {
    if (!selectedPlayerId) {
      return;
    }

    // Prevent duplicate report from frontend
    if (reportedPlayerIds.includes(selectedPlayerId)) {
      return;
    }

    const selectedPlayer = otherPlayers.find(
      (player) => player.id === selectedPlayerId,
    );

    if (!selectedPlayer) {
      return;
    }

    console.log("⚠ REPORT PLAYER:", selectedPlayer.name);

    socket.emit("report-player", {
      reportedPlayerId: selectedPlayerId,
    });

    setShowConcern(false);
    setSelectedPlayerId(null);
  };

  return (
    <>
      {/* ============================ */}
      {/* BOTTOM CONTROLS */}
      {/* ============================ */}

      <div className="h-full flex items-center justify-between px-4 relative">
        {/* LEFT */}
        <div className="hidden md:flex items-center h-full">
          <img
            src="/logo.png"
            alt="ooyo"
            className="h-9 w-auto object-contain"
          />
        </div>

        {/* CENTER */}
        <div
  className="
    flex
    items-center
    justify-center
    gap-6
    px-4
    py-1.5
    w-full
    md:w-auto
  "
>
          {/* Move Room */}
          <button
            onClick={handleMoveRoom}
            title="Move to another room"
            className="
              w-9
              h-9
              flex
              items-center
              justify-center
              hover:scale-110
              transition-all
              duration-200
            "
          >
            <img
              src="/skip-room.png"
              alt="Skip Room"
              className="w-8 h-8 object-contain"
            />
          </button>

          {/* Concern */}
          <button
            onClick={handleConcern}
            title="Report a player"
            className="
              w-9
              h-9
              flex
              items-center
              justify-center
              hover:scale-110
              transition-all
              duration-200
            "
          >
            <img
              src="/report.png"
              alt="Report"
              className="w-8 h-8 object-contain"
            />
          </button>

          {/* Leave Game */}
          <button
            onClick={handleLeaveGame}
            title="Leave game"
            className="
              w-9
              h-9
              flex
              items-center
              justify-center
              hover:scale-110
              transition-all
              duration-200
            "
          >
            <img
              src="/leave-room.png"
              alt="Leave Room"
              className="w-8 h-8 object-contain"
            />
          </button>

          {/* Ready / Unready */}
          <button
            onClick={handleReady}
            className={`
              px-5
              py-1.5
              rounded-xl
              text-xs
              font-semibold
              tracking-wide
              transition-all
              duration-200

              ${
                isReady
                  ? "bg-green-600 text-white hover:bg-green-500 active:scale-95"
                  : "bg-[#4C1D95] text-white hover:bg-[#5B21B6] active:scale-95"
              }
            `}
          >
            {isReady ? "I AM OUT" : "I AM IN"}
          </button>

          {/* MOBILE CHAT */}
<button
  onClick={onChatClick}
  title="Open chat"
  className="
    md:hidden
    w-11
    h-11
    flex
    items-center
    justify-center
    hover:scale-110
    transition-all
    duration-200
  "
>
  <img
    src="/chat-icon.png"
    alt="Chat"
    className="
      w-14
      h-14
      object-contain
    "
  />
</button>
        </div>

        {/* RIGHT */}
        <div className="hidden md:block text-xs text-gray-400 whitespace-nowrap">
          Live Players: {playerCount ?? 0}
        </div>
      </div>

      {/* ============================ */}
      {/* LEAVE CONFIRMATION POPUP */}
      {/* ============================ */}

      {showLeaveConfirm && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            px-4
          "
        >
          <div
            className="
              w-[340px]
              bg-[#050505]
              border
              border-white/20
              rounded-2xl
              shadow-2xl
              p-6
            "
          >
      

            {/* Title */}
            <h2 className="text-lg font-bold text-white">
              Leave ooyo?
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Are you sure you want to leave this room?
            </p>

            {/* Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCancelLeave}
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-gray-300
                  text-sm
                  font-semibold
                  hover:bg-white/10
                  hover:text-white
                  transition
                  active:scale-[0.98]
                "
              >
                Stay
              </button>

              <button
  onClick={handleConfirmLeave}
  className="
    flex-1
    py-2.5
    rounded-xl
    bg-white
    text-black
    text-sm
    font-semibold
    hover:bg-gray-200
    transition
    active:scale-[0.98]
  "
>
  Leave
</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================ */}
      {/* CONCERN POPUP */}
      {/* ============================ */}

      {showConcern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[340px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Report Player
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Select the player you want to report.
                </p>

                <p className="text-xs text-red-400 mt-2">
                  Players who receive 2 or more reports may be removed from
                  the room and may receive a temporary ban.
                </p>
              </div>

              <button
                onClick={handleCloseConcern}
                className="
                  text-gray-400
                  hover:text-white
                  text-lg
                  transition
                "
              >
                ✕
              </button>
            </div>

            {/* Player List */}
            <div className="space-y-2">
              {otherPlayers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No other players available.
                </p>
              ) : (
                otherPlayers.map((player) => {
                  const alreadyReported = reportedPlayerIds.includes(
                    player.id,
                  );

                  return (
                    <button
                      key={player.id}
                      disabled={alreadyReported}
                      onClick={() => {
                        if (!alreadyReported) {
                          setSelectedPlayerId(player.id);
                        }
                      }}
                      className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3
                        rounded-xl
                        border
                        transition-all

                        ${
                          alreadyReported
                            ? "bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed"
                            : selectedPlayerId === player.id
                              ? "bg-red-500/20 border-red-500 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                        }
                      `}
                    >
                      <span className="font-medium">
                        {player.name}
                      </span>

                      {alreadyReported && (
                        <span className="text-xs text-gray-500">
                          REPORTED
                        </span>
                      )}

                      {!alreadyReported &&
                        selectedPlayerId === player.id && (
                          <span className="text-red-400">
                            ✓
                          </span>
                        )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Report Button */}
            <button
              onClick={handleReport}
              disabled={!selectedPlayerId}
              className={`
                w-full
                mt-5
                py-3
                rounded-xl
                font-semibold
                transition-all

                ${
                  selectedPlayerId
                    ? "bg-red-600 hover:bg-red-500 text-white active:scale-95"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              REPORT
            </button>

            {/* Cancel */}
            <button
              onClick={handleCloseConcern}
              className="
                w-full
                mt-2
                py-2
                rounded-xl
                text-sm
                text-gray-400
                hover:text-white
                transition
              "
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BottomControls;