const { createGameState } = require("../game/gameState");

function createPlayer(socket) {
  return {
    id: socket.id,

    name: socket.playerName || "Anonymous",

    score: 0,

    ready: false,

    submitted: false,

    task: null,

    voted: false,

    connected: true,

    concern: false,

    // Reports received from unique players
    reportsReceived: [],
  };
}

function createRoom(roomId, socket) {
  return {
    id: roomId,

    players: [createPlayer(socket)],

    game: createGameState(),

    countdownStarted: false,

    // Reports made against players in this room
    reports: {},
  };
}

module.exports = {
  createPlayer,
  createRoom,
};
