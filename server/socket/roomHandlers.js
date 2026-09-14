const {
  getIpRecord,
  addReport,
  addStrike,
  getBanDuration,
  banIp,
  isIpBanned,
  getRemainingBanTime,
  shouldEnforceIpBan,
} = require("../moderation/moderationStore");

const BAN_DURATION = 60 * 60 * 1000;

const {
  findOrCreateRoom,
  findAvailableWaitingRoom,
  removePlayer,
  deleteRoomIfEmpty,
} = require("../rooms/roomManager");

// ============================
// REPORT STATUS HELPER
// ============================

function getReportedPlayerIds(room, reporterId) {
  if (!room || !room.players) {
    return [];
  }

  return room.players
    .filter((player) =>
      player.reportsReceived?.includes(reporterId)
    )
    .map((player) => player.id);
}

function registerRoomHandlers(io, socket, rooms) {
 socket.on("join-game", ({ name }) => {

  // ============================
  // SET PLAYER NAME
  // ============================

  socket.playerName = name;

  // ============================
  // SERVER-SIDE IP BAN CHECK
  // ============================

  if (
    shouldEnforceIpBan() &&
    isIpBanned(socket.playerIp)
  ) {

    const remainingTime =
      getRemainingBanTime(socket.playerIp);

    console.log(
      `🚫 BANNED PLAYER BLOCKED: ${socket.playerIp}`
    );

    console.log(
      `⏳ REMAINING BAN TIME: ${remainingTime}ms`
    );

    socket.emit(
      "join-denied",
      {
        reason: "IP_BANNED",
        remainingTime,
      }
    );

    return;
  }

  // ============================
  // FIND / CREATE ROOM
  // ============================

  const roomId =
    findOrCreateRoom(
      rooms,
      socket
    );

  socket.join(roomId);

  socket.roomId = roomId;

  console.log(
    `${socket.playerName} joined ${roomId}`
  );

  io.to(roomId).emit(
    "room-update",
    {
      roomId,
      players:
        rooms[roomId].players,
    }
  );

  // ============================
  // REPORT STATUS
  // ============================

  socket.emit(
    "report-status",
    {
      reportedPlayerIds:
        getReportedPlayerIds(
          rooms[roomId],
          socket.id
        ),
    }
  );
});

  // ============================
  // MOVE ROOM
  // ============================

  socket.on("move-room", ({ roomId }) => {
    const currentRoom = rooms[roomId];

    if (!currentRoom) return;

    // Moving rooms is only allowed while waiting
    if (currentRoom.game.phase !== "waiting") {
      return;
    }

    const player = currentRoom.players.find(
      (player) => player.id === socket.id,
    );

    if (!player) return;

    const targetRoomId = findAvailableWaitingRoom(rooms, roomId);

    if (!targetRoomId) {
      socket.emit("move-room-failed", {
        reason: "NO_ROOM_AVAILABLE",
      });

      return;
    }

    const targetRoom = rooms[targetRoomId];

    // Remove player from current room
    currentRoom.players = currentRoom.players.filter(
      (player) => player.id !== socket.id,
    );

    // The room changed, so remaining players must ready again
    currentRoom.players.forEach((player) => {
      player.ready = false;
    });

    // Add player to target room
    targetRoom.players.push(player);

    // New room starts with this player unready
    player.ready = false;

    // Leave old Socket.IO room
    socket.leave(roomId);

    // Join new Socket.IO room
    socket.join(targetRoomId);

    // Update socket's current room
    socket.roomId = targetRoomId;

    console.log(`${player.name} moved from ${roomId} → ${targetRoomId}`);

    // Update old room
    io.to(roomId).emit("room-update", {
      roomId,
      players: currentRoom.players,
    });

    io.to(roomId).emit("ready-update", {
      readyPlayers: currentRoom.players.filter((player) => player.ready).length,
      totalPlayers: currentRoom.players.length,
    });

    // Update new room
    io.to(targetRoomId).emit("room-update", {
      roomId: targetRoomId,
      players: targetRoom.players,
    });

    io.to(targetRoomId).emit("ready-update", {
      readyPlayers: targetRoom.players.filter((player) => player.ready).length,
      totalPlayers: targetRoom.players.length,
    });
  });

  // ============================
  // LEAVE GAME
  // ============================

  socket.on("leave-game", ({ roomId }) => {
    console.log(`🚪 LEAVE GAME REQUEST: ${socket.playerName} from ${roomId}`);

    const room = rooms[roomId];

    if (!room) {
      return;
    }

    const player = room.players.find((player) => player.id === socket.id);

    if (!player) {
      return;
    }

    // Remove player from game room
    removePlayer(rooms, roomId, socket.id);

    // Leave Socket.IO room
    socket.leave(roomId);

    // Clear socket's current room
    socket.roomId = null;

    console.log(`🚪 ${player.name} left ${roomId}`);

    // ============================
    // DELETE EMPTY ROOM
    // ============================

    const deleted = deleteRoomIfEmpty(rooms, roomId);

    if (deleted) {
      console.log(`Deleted empty room ${roomId}`);
    } else {
      // ============================
      // UPDATE REMAINING PLAYERS
      // ============================

      io.to(roomId).emit("room-update", {
        roomId,
        players: room.players,
      });

      io.to(roomId).emit("ready-update", {
        readyPlayers: room.players.filter((player) => player.ready).length,

        totalPlayers: room.players.length,
      });
    }

    // ============================
    // TELL CLIENT TO RETURN HOME
    // ============================

    socket.emit("game-left");
  });

// ============================
// REACTIONS
// ============================

socket.on("send-reaction", ({ emoji }) => {
  const roomId = socket.roomId;

  if (!roomId) {
    return;
  }

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  io.to(roomId).emit("receive-reaction", {
    emoji,
  });
});

// ============================
// CHAT MESSAGES
// ============================

socket.on("send-message", ({ message }) => {
  const roomId = socket.roomId;

  if (!roomId) {
    return;
  }

  const room = rooms[roomId];

  if (!room) {
    return;
  }

  if (!message || !message.trim()) {
    return;
  }

  io.to(roomId).emit("receive-message", {
    playerId: socket.id,
    playerName: socket.playerName,
    message: message.trim(),
  });
});

  // ============================
  // REPORT PLAYER
  // ============================

  socket.on("report-player", ({ reportedPlayerId }) => {
    // ============================
    // SERVER DECIDES ROOM
    // ============================

    const roomId = socket.roomId;

    console.log(
      `⚠ REPORT REQUEST: ${socket.playerName} reported ${reportedPlayerId} in ${roomId}`,
    );

    // ============================
    // FIND ROOM
    // ============================

    const room = rooms[roomId];

    if (!room) {
      console.log("❌ REPORT FAILED: ROOM NOT FOUND");
      return;
    }

    // ============================
    // FIND REPORTER
    // ============================

    const reporter = room.players.find((player) => player.id === socket.id);

    if (!reporter) {
      console.log("❌ REPORT FAILED: REPORTER NOT IN ROOM");
      return;
    }

    // ============================
    // FIND REPORTED PLAYER
    // ============================

    const reportedPlayer = room.players.find(
      (player) => player.id === reportedPlayerId,
    );

    if (!reportedPlayer) {
      console.log("❌ REPORT FAILED: PLAYER NOT FOUND");
      return;
    }

    // ============================
    // PREVENT SELF REPORT
    // ============================

    if (reporter.id === reportedPlayer.id) {
      console.log("❌ REPORT FAILED: SELF REPORT");
      return;
    }

    // ============================
    // DUPLICATE REPORT
    // ============================

    if (reportedPlayer.reportsReceived.includes(reporter.id)) {
      console.log(
        `❌ DUPLICATE REPORT: ${reporter.name} already reported ${reportedPlayer.name}`,
      );

      return;
    }

    // ============================
    // ADD REPORTER
    // ============================

    reportedPlayer.reportsReceived.push(reporter.id);

    socket.emit("report-status", {
      reportedPlayerIds: getReportedPlayerIds(room, socket.id),
    });

    const reportCount = reportedPlayer.reportsReceived.length;

    console.log(
      `⚠ ${reportedPlayer.name} now has ${reportCount} unique report(s)`,
    );

    // ============================
    // GET REPORTED PLAYER SOCKET
    // ============================

    const reportedSocket = io.sockets.sockets.get(reportedPlayer.id);

    // ============================
    // RECORD REPORT AGAINST IP
    // ============================

    if (reportedSocket?.playerIp) {
      const ip = reportedSocket.playerIp;

      const moderationRecord = addReport(ip);

      console.log(`🛡 IP REPORT RECORDED: ${ip}`);

      console.log("🛡 MODERATION DATA:", moderationRecord);

      console.log(
        `🛡 IP ${ip} has ${moderationRecord.reports.length} moderation report(s)`,
      );
    }

    // ============================
    // NOTIFY REPORTED PLAYER
    // ============================

    if (reportedSocket && reportCount < 2) {
      reportedSocket.emit("player-reported", {
        reportCount,

        message:
          "You have been reported. Please be careful and follow the game rules.",
      });
    }

    // ============================
    // REPORT THRESHOLD
    // ============================

    if (reportCount < 2) {
      return;
    }

    console.log(`🚨 REPORT LIMIT REACHED: ${reportedPlayer.name}`);

    // ============================
    // ADD ONE STRIKE
    // ============================

    if (reportedSocket?.playerIp) {
      const ip = reportedSocket.playerIp;

      const newStrike = addStrike(ip);

      console.log(`⚠ STRIKE ADDED: ${ip} → Strike ${newStrike}`);

      // ============================
      // GET BAN DURATION
      // ============================

      const banDuration = getBanDuration(newStrike);

      // ============================
      // APPLY BAN
      // ============================

      if (banDuration > 0) {
        const updatedRecord = banIp(ip, banDuration);

        console.log(`🚫 IP BANNED: ${ip}`);

        console.log("🚫 BAN DATA:", updatedRecord);
      }
    }

    // ============================
    // REMOVE PLAYER FROM ROOM
    // ============================

    removePlayer(rooms, roomId, reportedPlayer.id);

    // ============================
    // REMOVE SOCKET FROM ROOM
    // ============================

    if (reportedSocket) {
      reportedSocket.leave(roomId);

      reportedSocket.roomId = null;

      reportedSocket.emit("player-removed", {
        reason: "TOO_MANY_REPORTS",
      });
    }

    console.log(`🚨 ${reportedPlayer.name} was removed from ${roomId}`);

    // ============================
    // DELETE EMPTY ROOM
    // ============================

    const deleted = deleteRoomIfEmpty(rooms, roomId);

    if (deleted) {
      console.log(`Deleted empty room ${roomId}`);

      return;
    }

    // ============================
    // UPDATE REMAINING PLAYERS
    // ============================
io.to(roomId).emit("room-update", {
  roomId,
  players: room.players,
});

io.to(roomId).emit("ready-update", {
  readyPlayers: room.players.filter(
    (player) => player.ready
  ).length,

  totalPlayers: room.players.length,
});

// ============================
// REFRESH REPORT STATUS
// ============================

room.players.forEach((player) => {
  const playerSocket =
    io.sockets.sockets.get(player.id);

  if (!playerSocket) {
    return;
  }

  playerSocket.emit("report-status", {
    reportedPlayerIds:
      getReportedPlayerIds(
        room,
        player.id
      ),
  });
});
  });
}

module.exports = {
  registerRoomHandlers,
};
