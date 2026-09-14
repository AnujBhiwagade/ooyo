function broadcastGameState(io, rooms, roomId) {
  const room = rooms[roomId];

  if (!room) return;

  io.to(roomId).emit("game-state-update", {
    roomId,

    players: room.players,

    phase: room.game.phase,

    mode: room.game.mode,

    selectedPlayer: room.game.selectedPlayer,

    submittedTasks: room.game.submittedTasks,

    chosenTask: room.game.chosenTask,

    countdown: room.game.countdown,

    timer: room.game.timer,

    result: room.game.result,

    successVotes: room.game.successVotes,

    failVotes: room.game.failVotes,
  });
}

module.exports = {
  broadcastGameState,
};