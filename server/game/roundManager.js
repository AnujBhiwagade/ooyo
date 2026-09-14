function resetRound(room) {
  room.players.forEach((player) => {
    player.ready = false;
    player.submitted = false;
    player.task = null;
    player.voted = false;
  });

  

  room.countdownStarted = false;

  // ==========================================
  // RESET GAME STATE
  // ==========================================

  room.game.phase = "waiting";

  room.game.selectedPlayer = null;

  room.game.submittedTasks = [];

  room.game.chosenTask = null;

  room.game.mode = null;

  room.game.countdown = null;

  room.game.timer = null;

  room.game.successVotes = [];

  room.game.failVotes = [];

  room.game.result = null;
}

module.exports = {
  resetRound,
};