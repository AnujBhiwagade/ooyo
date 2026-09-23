import socket from "../../socket/socket";
import { useState } from "react";

function GamePanel({
  roomData,
  readyData,
  gameState,
}) {
  const [taskInput, setTaskInput] = useState("");

  console.log("GAME PANEL READY DATA:", readyData);

  const currentPlayer = gameState?.players?.find(
    (player) => player.id === socket.id,
  );

  const submitted = currentPlayer?.submitted ?? false;
  const voteSubmitted = currentPlayer?.voted ?? false;

  /*
   * Main centered stage used by every game phase.
   *
   * flex-1 + min-h-0 gives the stage the complete
   * available height inside the GamePanel.
   */
  const centerStage = `
    flex-1
    min-h-0
    w-full
    flex
    flex-col
    items-center
    justify-center
    text-center
    px-3
    md:px-4
  `;

  /*
   * Result normalization.
   */
  const normalizedResult = String(gameState?.result ?? "")
    .trim()
    .toLowerCase();

  const isLoss =
    normalizedResult.includes("fail") ||
    normalizedResult.includes("loss") ||
    normalizedResult.includes("lose") ||
    normalizedResult.includes("lost");

  const isWin =
    normalizedResult.includes("success") ||
    normalizedResult.includes("win") ||
    normalizedResult.includes("won") ||
    normalizedResult.includes("cleared");

  const resultTitle = isLoss
    ? "FAILED"
    : isWin
      ? "CLEARED"
      : gameState?.result || "ROUND COMPLETE";

  const resultMessage = isLoss
    ? `${gameState?.selectedPlayer?.name} failed the challenge.`
    : isWin
      ? `${gameState?.selectedPlayer?.name} cleared the challenge!`
      : "The round is complete.";

  return (
    <div
      className="
        w-full
        md:w-[320px]
        border-l
        border-white/10
        bg-black/40
        backdrop-blur-xl
        flex
        flex-col
        min-h-0
        h-full
      "
    >
      {/* ========================= */}
      {/* GAME CONTENT */}
      {/* ========================= */}

      <div
        className="
          flex-1
          min-h-0
          p-1.5
          md:p-2
          overflow-hidden
          flex
          flex-col
        "
      >

        {/* ========================= */}
        {/* WAITING */}
        {/* ========================= */}

{(!gameState || gameState?.phase === "waiting") && (
  <div className="h-full w-full flex flex-col">

    {/* STATUS ROW */}
    <div
      className="
        w-full
        shrink-0
        flex
        items-center
        justify-between
        px-2
        py-1
        text-xs
      "
    >
      <span className="text-gray-400">
        Room Status
      </span>

      <span className="text-green-400">
        {(roomData?.players?.length ?? 0) < 4
          ? "WAITING"
          : "GET READY"}
      </span>
    </div>

    {/* CENTERED GAME CONTENT */}
    <div
      className="
        flex-1
        min-h-0
        w-full
        flex
        flex-col
        items-center
        justify-center
        text-center
        px-3
        md:px-4
      "
    >
      {(roomData?.players?.length ?? 0) < 4 ? (
        <>
          <div className="text-4xl md:text-5xl font-bold text-white">
            {roomData?.players?.length ?? 0}
            <span className="text-gray-600">
              {" "}
              / 4
            </span>
          </div>

          <div className="mt-1 text-sm text-gray-400">
            Waiting for players...
          </div>
        </>
      ) : (
        <>
          <div className="text-4xl md:text-5xl font-bold text-white">
            4
            <span className="text-gray-600">
              {" "}
              / 4
            </span>
          </div>

          <p className="mt-1 text-sm text-green-400">
            Everyone joined 🎉
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Get ready for the next round
          </p>
        </>
      )}
    </div>
  </div>
)}

        {/* ========================= */}
        {/* COUNTDOWN */}
        {/* ========================= */}

        {gameState?.phase === "countdown" && (
          <div className={centerStage}>
            <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-gray-500">
              ROUND STARTING
            </p>

            <h1
              className="
                text-6xl
                md:text-7xl
                font-bold
                text-white
                mt-3
                leading-none
              "
            >
              {gameState?.countdown}
            </h1>
          </div>
        )}

        {/* ========================= */}
        {/* CHOICE */}
        {/* ========================= */}

        {gameState?.phase === "choice" && (
          <div className={centerStage}>
            {socket.id === gameState?.selectedPlayer?.id ? (
              <>
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-purple-300">
                  YOUR TURN
                </p>

                <h2 className="text-lg font-bold text-white mt-2 md:mt-3">
                  Truth or Dare?
                </h2>

                <div className="flex gap-2 md:gap-3 mt-5 md:mt-6 w-full max-w-[280px]">
                  <button
                    onClick={() => {
                      socket.emit("choose-mode", {
                        roomId: gameState?.roomId,
                        mode: "truth",
                      });
                    }}
                    className="
  flex-1
  py-3
  md:py-2.5
  rounded-xl
  bg-white
  border
  border-gray-300
  text-gray-900
  font-semibold
  shadow-md
  hover:bg-gray-100
  active:scale-[0.98]
  transition-all
  duration-200
"
                  >
                    Truth
                  </button>

                  <button
                    onClick={() => {
                      socket.emit("choose-mode", {
                        roomId: gameState?.roomId,
                        mode: "dare",
                      });
                    }}
                    className="
  flex-1
  py-3
  md:py-2.5
  rounded-xl
  bg-[#4C1D95]
  border
  border-purple-500
  text-white
  font-semibold
  shadow-md
  hover:bg-purple-600
  active:scale-[0.98]
  transition-all
  duration-200
"
                  >
                    Dare
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-500">
                  SELECTED PLAYER
                </div>

                <p className="text-lg font-semibold text-white mt-2 md:mt-3">
                  {gameState?.selectedPlayer?.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  is choosing Truth or Dare
                </p>
              </>
            )}
          </div>
        )}

        {/* ========================= */}
        {/* SUBMISSION */}
        {/* ========================= */}

        {gameState?.phase === "submission" && (
          <div className={centerStage}>
            {socket.id === gameState?.selectedPlayer?.id ? (
              <>
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-purple-300">
                  CHALLENGE SETUP
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                  {gameState?.submittedTasks?.length || 0}
                  <span className="text-gray-600">
                    {" "}
                    / 3
                  </span>
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  questions submitted
                </p>

                <p className="text-xs text-gray-500 mt-3">
                  Waiting for the others...
                </p>
              </>
            ) : submitted ? (
              <div
                className="
                  w-full
                  max-w-[280px]
                  py-5
                  rounded-xl
                  bg-green-500/10
                  border
                  border-green-500/20
                "
              >
                <div className="text-green-400 text-xl">
                  ✓
                </div>

                <p className="text-sm font-semibold text-green-300 mt-2">
                  Question Submitted
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Waiting for the other players...
                </p>
              </div>
            ) : (
              <div
                className="
                  w-full
                  max-w-[280px]
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-purple-300">
                  YOUR TURN
                </p>

                <p className="text-sm text-gray-400 mt-2 md:mt-3">
                  {gameState?.mode === "truth"
                    ? "Write a question for"
                    : "Write a dare for"}
                </p>

                <h2 className="text-lg font-bold text-white mt-1">
                  {gameState?.selectedPlayer?.name}
                </h2>

                <textarea
                  value={taskInput}
                  onChange={(e) =>
                    setTaskInput(e.target.value)
                  }
                  placeholder={
                    gameState?.mode === "truth"
                      ? "Write a fun question..."
                      : "Write a fun dare..."
                  }
                  className="
                    w-full
                    h-20
                    mt-4
                    md:mt-5
                    rounded-xl
                    bg-gray-900
                    border
                    border-gray-700
                    px-3
                    py-2
                    text-sm
                    text-white
                    placeholder-gray-500
                    resize-none
                    outline-none
                    focus:border-purple-500
                    transition
                  "
                />

                <button
                  onClick={() => {
                    if (!taskInput.trim()) return;

                    socket.emit("submit-task", {
                      roomId: gameState?.roomId,
                      task: taskInput.trim(),
                    });

                    setTaskInput("");
                  }}
                  className="
                    w-full
                    py-3
                    md:py-2.5
                    mt-3
                    rounded-xl
                    bg-[#4C1D95]
                    hover:bg-purple-500
                    active:scale-[0.98]
                    transition-all
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  {gameState?.mode === "truth"
                    ? "Send Question"
                    : "Send Dare"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================= */}
        {/* TASK SELECTION */}
        {/* ========================= */}

        {gameState?.phase === "task-selection" && (
          <div className={centerStage}>
            {socket.id === gameState?.selectedPlayer?.id ? (
              <div className="w-full max-w-[280px]">
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-purple-300">
                  CHOOSE A CHALLENGE
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Pick one question from the players
                </p>

                <div className="mt-4 md:mt-5 space-y-2 max-h-[150px] overflow-y-auto scrollbar-hide">
                  {gameState?.players
                    ?.filter(
                      (player) =>
                        player.submitted && player.task,
                    )
                    .map((player, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          socket.emit("choose-task", {
                            roomId: gameState?.roomId,
                            task: player.task,
                          });
                        }}
                        className="
                          w-full
                          px-3
                          py-2.5
                          md:py-2
                          rounded-lg
                          bg-white/[0.03]
                          border
                          border-white/[0.08]
                          hover:bg-white/[0.07]
                          hover:border-purple-400/40
                          transition
                          text-xs
                          text-gray-300
                          text-center
                        "
                      >
                        {player.task}
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <>
                <div className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-500">
                  WAITING
                </div>

                <p className="text-sm text-gray-400 mt-3">
                  Waiting for selected player...
                </p>
              </>
            )}
          </div>
        )}

        {/* ========================= */}
        {/* TASK ACTIVE */}
        {/* ========================= */}

        {gameState?.phase === "task-active" && (
          <div className={centerStage}>
            <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-400">
              CURRENT CHALLENGE
            </p>

            <div
  className="
    w-full
    max-w-[280px]
    mt-3
    md:mt-4
    px-4
    py-4
    rounded-xl
    bg-gray-100
    border
    border-gray-300
    shadow-sm
  "
>
  <p className="text-sm text-gray-900 leading-relaxed font-medium">
    {gameState?.chosenTask}
  </p>
</div>

            <div className="text-yellow-400 font-semibold text-xl mt-4 md:mt-5">
              {gameState?.timer}s
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* VOTING */}
        {/* ========================= */}

        {gameState?.phase === "voting" && (
          <div className={centerStage}>
            {socket.id === gameState?.selectedPlayer?.id ? (
              <>
                <div className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-500">
                  VOTING
                </div>

                <p className="text-sm text-gray-400 mt-3">
                  Waiting for player votes...
                </p>
              </>
            ) : (
              <div className="w-full max-w-[280px]">
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-400 mb-4 md:mb-5">
                  CHALLENGE COMPLETE?
                </p>

                <div className="w-full space-y-2">
                  <button
                    onClick={() => {
                      socket.emit("vote-result", {
                        roomId: gameState?.roomId,
                        vote: "success",
                      });
                    }}
                    disabled={voteSubmitted}
                    className={`
                      w-full
                      py-3
                      md:py-2.5
                      rounded-xl
                      border
                      font-semibold
                      text-sm
                      transition-all
                      duration-200

                      ${
                        voteSubmitted
                          ? "bg-green-700/40 border-green-500/30 text-green-300 cursor-not-allowed"
                          : "bg-green-600 border-green-500 text-white hover:bg-green-500 active:scale-[0.98]"
                      }
                    `}
                  >
                    {voteSubmitted
                      ? "✓ VOTE SUBMITTED"
                      : "CLEARED"}
                  </button>

                  <button
                    onClick={() => {
                      socket.emit("vote-result", {
                        roomId: gameState?.roomId,
                        vote: "fail",
                      });
                    }}
                    disabled={voteSubmitted}
                    className={`
                      w-full
                      py-3
                      md:py-2.5
                      rounded-xl
                      border
                      font-semibold
                      text-sm
                      transition-all
                      duration-200

                      ${
                        voteSubmitted
                          ? "bg-red-700/40 border-red-500/30 text-red-300 cursor-not-allowed"
                          : "bg-red-600 border-red-500 text-white hover:bg-red-500 active:scale-[0.98]"
                      }
                    `}
                  >
                    {voteSubmitted
                      ? "✓ VOTE SUBMITTED"
                      : "FAILED"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================= */}
        {/* RESULT */}
        {/* ========================= */}

        {gameState?.phase === "result" && (
          <div className={centerStage}>
            <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-purple-300">
              ROUND RESULT
            </p>

            <h2
              className={`
                text-2xl
                md:text-3xl
                font-black
                mt-3
                md:mt-4
                ${
                  isLoss
                    ? "text-red-400"
                    : isWin
                      ? "text-green-400"
                      : "text-white"
                }
              `}
            >
              {resultTitle}
            </h2>

            <p className="text-sm text-gray-400 mt-2 md:mt-3">
              {resultMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePanel;