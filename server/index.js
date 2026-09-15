const { registerVideoHandlers } = require("./socket/videoHandlers");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const {
  getIpRecord,
  isIpBanned,
  getRemainingBanTime,
} = require("./moderation/moderationStore");

const {
  getRoom,
  removePlayer,
  deleteRoomIfEmpty,
} = require("./rooms/roomManager");

const { broadcastGameState } = require("./socket/broadcaster");

const { createGameState } = require("./game/gameState");

const { registerGameHandlers } = require("./socket/gameHandlers");

const { registerRoomHandlers } = require("./socket/roomHandlers");

const app = express();

app.use(cors());

const server = http.createServer(app);

const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

// ============================
// GLOBAL STATE
// ============================

let connectedPlayers = 0;

const rooms = {};

// ============================
// SOCKET CONNECTION
// ============================

io.on("connection", (socket) => {
  // ============================
  // PLAYER IP
  // ============================

  const playerIp =
    socket.handshake.headers["x-forwarded-for"]
      ?.split(",")[0]
      .trim() ||
    socket.handshake.address;

  socket.playerIp = playerIp;

  // ============================
  // CHECK IP BAN
  // ============================

  if (isIpBanned(socket.playerIp)) {
    const remainingBanTime =
      getRemainingBanTime(socket.playerIp);

    console.log(
      `Banned IP rejected: ${socket.playerIp}`,
    );

    socket.emit("player-banned", {
      reason: "TEMPORARY_BAN",
      remainingMs: remainingBanTime,
    });

    socket.disconnect(true);

    return;
  }

  // ============================
  // MODERATION RECORD
  // ============================

  const moderationRecord =
    getIpRecord(socket.playerIp);

  socket.moderationRecord = moderationRecord;

  // ============================
  // COUNT CONNECTED PLAYERS
  // ============================

  connectedPlayers++;

  io.emit(
    "player-count",
    connectedPlayers,
  );

  // ============================
  // REGISTER SOCKET HANDLERS
  // ============================

  registerGameHandlers(
    io,
    socket,
    rooms,
  );

  registerRoomHandlers(
    io,
    socket,
    rooms,
  );

  registerVideoHandlers(
    io,
    socket,
  );

  // ============================
  // DISCONNECT
  // ============================

  socket.on("disconnect", () => {
    connectedPlayers--;

    io.emit(
      "player-count",
      connectedPlayers,
    );

    // ==========================================
    // REMOVE PLAYER FROM THEIR ROOM
    // ==========================================

    for (const roomId in rooms) {
      const room = getRoom(
        rooms,
        roomId,
      );

      if (!room) {
        continue;
      }

      const playerExists =
        room.players.some(
          (player) =>
            player.id === socket.id,
        );

      if (!playerExists) {
        continue;
      }

      removePlayer(
        rooms,
        roomId,
        socket.id,
      );

      io.to(roomId).emit(
        "room-update",
        {
          roomId,
          players: room.players,
        },
      );

      broadcastGameState(
        io,
        rooms,
        roomId,
      );

      // ==========================================
      // ROOM NO LONGER FULL
      // ==========================================

      if (room.players.length < 4) {
        room.countdownStarted = false;

        room.game = createGameState();

        room.players.forEach((player) => {
          player.ready = false;
          player.submitted = false;
          player.task = null;
          player.voted = false;
        });
      }

      broadcastGameState(
        io,
        rooms,
        roomId,
      );

      // ==========================================
      // DELETE EMPTY ROOM
      // ==========================================

      deleteRoomIfEmpty(
        rooms,
        roomId,
      );
    }
  });
});

// ============================
// START SERVER
// ============================

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});