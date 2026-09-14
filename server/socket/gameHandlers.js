const {
  startCountdown,
  selectRandomPlayer,
  chooseMode,
  submitTask,
  chooseTask,
  startTaskTimer,
  submitVote,
  calculateVoteResult,
} = require("../game/gameEngine");

const { resetRound } = require("../game/roundManager");

const { broadcastGameState } = require("./broadcaster");

function registerGameHandlers(io, socket, rooms) {
  // ============================
  // PLAYER READY
  // ============================

  socket.on("player-ready", ({ roomId }) => {
    const room = rooms[roomId];

    if (!room) return;

    console.log("PLAYER READY EVENT RECEIVED");
    console.log("Room:", roomId);
    console.log("Phase:", room.game.phase);
    console.log("Socket:", socket.id);

    // Ready is only allowed during waiting phase
    if (room.game.phase !== "waiting") {
      return;
    }

    const player = room.players.find(
      (player) => player.id === socket.id,
    );

    if (!player) return;

    // Toggle ready / unready
    player.ready = !player.ready;

    const readyCount = room.players.filter(
      (player) => player.ready,
    ).length;

    console.log(
      `Ready Players in ${roomId}: ${readyCount}/${room.players.length}`,
    );

    // Broadcast updated ready state
    broadcastGameState(io, rooms, roomId);

    io.to(roomId).emit("room-update", {
      roomId,
      players: room.players,
    });

    // Start only when every player is ready
    if (
      readyCount === room.players.length &&
      room.players.length === 4 &&
      !room.countdownStarted
    ) {
      /*
       * IMPORTANT:
       *
       * Select the player BEFORE the countdown.
       *
       * This means the bottle already knows its
       * destination during the entire 5-second
       * countdown.
       */
      const selectedPlayer = selectRandomPlayer(room);

      console.log(
        `Selected Player: ${selectedPlayer.name}`,
      );

      /*
       * selectRandomPlayer() only selects the player.
       *
       * startCountdown() changes the phase to
       * "countdown".
       */
      startCountdown(
        room,

        // Every second
        () => {
          broadcastGameState(
            io,
            rooms,
            roomId,
          );
        },

        // Countdown finished
        () => {
          /*
           * startCountdown() already changes the
           * phase to "choice" when countdown reaches 0.
           *
           * DO NOT select the player again here.
           */

          broadcastGameState(
            io,
            rooms,
            roomId,
          );

          console.log(
            `Countdown finished in ${roomId}`,
          );

          console.log(
            `Selected Player: ${room.game.selectedPlayer?.name}`,
          );
        },
      );
    }
  });

  // ============================
  // CHOOSE MODE
  // ============================

  socket.on("choose-mode", ({ roomId, mode }) => {
    const room = rooms[roomId];

    if (!room) return;

    const success = chooseMode(room, mode);

    if (!success) {
      return;
    }

    console.log(
      `${room.game.selectedPlayer.name} selected ${mode}`,
    );

    broadcastGameState(
      io,
      rooms,
      roomId,
    );
  });

  // ============================
  // SUBMIT TASK
  // ============================

  socket.on("submit-task", ({ roomId, task }) => {
    const room = rooms[roomId];

    if (!room) return;

    const submittedCount = submitTask(
      room,
      socket.id,
      task,
    );

    if (submittedCount === null) {
      return;
    }

    console.log("Tasks:", submittedCount);

    broadcastGameState(
      io,
      rooms,
      roomId,
    );
  });

  // ============================
  // CHOOSE TASK
  // ============================

  socket.on("choose-task", ({ roomId, task }) => {
    const room = rooms[roomId];

    if (!room) return;

    const success = chooseTask(
      room,
      task,
    );

    if (!success) {
      return;
    }

    broadcastGameState(
      io,
      rooms,
      roomId,
    );

    startTaskTimer(
      room,

      // Every second
      () => {
        broadcastGameState(
          io,
          rooms,
          roomId,
        );
      },

      // Timer finished
      () => {
        room.game.phase = "voting";

        broadcastGameState(
          io,
          rooms,
          roomId,
        );
      },
    );
  });

  // ============================
  // VOTE RESULT
  // ============================

  socket.on("vote-result", ({ roomId, vote }) => {
    console.log(
      `${socket.playerName} voted ${vote}`,
    );

    const room = rooms[roomId];

    if (!room) return;

    const voteResult = submitVote(
      room,
      socket.id,
      vote,
    );

    if (!voteResult) {
      return;
    }

    console.log(
      `Votes: ${voteResult.totalVotes}/${voteResult.requiredVotes}`,
    );

    if (voteResult.votingComplete) {
      room.game.phase = "result";

      calculateVoteResult(room);

      broadcastGameState(
        io,
        rooms,
        roomId,
      );

      setTimeout(() => {
        resetRound(room);

        broadcastGameState(
          io,
          rooms,
          roomId,
        );

        io.to(roomId).emit(
          "round-reset",
        );
      }, 3000);

      return;
    }

    broadcastGameState(
      io,
      rooms,
      roomId,
    );
  });

  // ============================
  // TASK COMPLETE
  // ============================

  socket.on("task-complete", ({ roomId }) => {
    const room = rooms[roomId];

    if (!room) return;

    resetRound(room);

    broadcastGameState(
      io,
      rooms,
      roomId,
    );

    io.to(roomId).emit(
      "round-reset",
    );

    console.log(
      `Round reset in ${roomId}`,
    );
  });
}

module.exports = {
  registerGameHandlers,
};