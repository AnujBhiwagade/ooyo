import { useEffect, useRef } from "react";

function PlayerTile({
  player,
  selected,
  gameState,
  localStream,
}) {
  const videoRef = useRef(null);

  // ============================
  // ATTACH VIDEO STREAM
  // ============================

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (!localStream) {
      videoRef.current.srcObject = null;
      return;
    }

    videoRef.current.srcObject = localStream;
  }, [localStream]);

  // ============================
  // SELECTED PLAYER GLOW
  // ============================

  const showSelected =
    selected &&
    (
      gameState?.countdown === 0 ||
      gameState?.phase === "choice"
    );

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        shadow-xl
        transition
        duration-300
        md:hover:scale-[1.02]
        bg-gray-800
      "
    >
      {/* ============================ */}
      {/* VIDEO */}
      {/* ============================ */}

      {localStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-gray-700
            to-gray-900
          "
        />
      )}

      {/* ============================ */}
      {/* SELECTED INNER GLOW */}
      {/* ============================ */}

      {showSelected && (
        <div
          className="
            absolute
            inset-0
            rounded-2xl
            border-[3px]
            border-purple-500
            shadow-[inset_0_0_20px_rgba(168,85,247,0.35)]
            pointer-events-none
            z-10
          "
        />
      )}

      {/* ============================ */}
      {/* PLAYER NAME */}
      {/* ============================ */}

      <div
        className="
          absolute
          top-2
          left-2
          md:top-3
          md:left-3
          z-30
        "
      >
        <div
          className="
            text-xs
            md:text-sm
            font-semibold
            tracking-wide
            text-white
            drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]
          "
        >
          {player.name}
        </div>
      </div>

      {/* ============================ */}
      {/* READY INDICATOR */}
      {/* ============================ */}

      {player.ready &&
        gameState?.phase === "waiting" && (
          <div
            className="
              absolute
              top-2
              right-2
              md:top-3
              md:right-3
              w-4
              h-4
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              text-black
              text-[9px]
              font-bold
              z-30
            "
          >
            ✓
          </div>
        )}
    </div>
  );
}

export default PlayerTile;