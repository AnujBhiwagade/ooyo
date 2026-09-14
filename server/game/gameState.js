function createGameState() {
  return {
    phase: "waiting",

    selectedPlayer: null,

    submittedTasks: [],

    chosenTask: null,

    mode: null,

    countdown: null,

    timer: null,

    successVotes: [],

    failVotes: [],

    result: null,
  };
}

module.exports = {
  createGameState,
};