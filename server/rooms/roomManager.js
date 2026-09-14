const {
  createRoom,
  createPlayer,
} = require("./roomState");

// ============================
// FIND OR CREATE ROOM
// ============================

function findOrCreateRoom(rooms, socket) {
  // Find an available waiting room
  for (const roomId in rooms) {
    const room = rooms[roomId];

    if (
      room.players.length < 4 &&
      room.game.phase === "waiting"
    ) {
      room.players.push(
        createPlayer(socket),
      );

      return roomId;
    }
  }

  // Create a new room
  const newRoomId = `room-${Date.now()}`;

  rooms[newRoomId] = createRoom(
    newRoomId,
    socket,
  );

  return newRoomId;
}

// ============================
// GET ROOM
// ============================

function getRoom(rooms, roomId) {
  return rooms[roomId];
}

// ============================
// REMOVE PLAYER
// ============================

function removePlayer(
  rooms,
  roomId,
  socketId,
) {
  const room = rooms[roomId];

  if (!room) {
    return null;
  }

  room.players = room.players.filter(
    (player) => player.id !== socketId,
  );

  return room;
}

// ============================
// DELETE EMPTY ROOM
// ============================

function deleteRoomIfEmpty(
  rooms,
  roomId,
) {
  const room = rooms[roomId];

  if (!room) {
    return false;
  }

  if (room.players.length === 0) {
    delete rooms[roomId];

    return true;
  }

  return false;
}

// ============================
// REBALANCE WAITING ROOMS
// ============================

function rebalanceWaitingRooms(rooms) {
  const moves = [];

  const waitingRooms =
    Object.entries(rooms).filter(
      ([, room]) =>
        room.game.phase === "waiting",
    );

  // Fill waiting rooms with available players
  for (
    let i = 0;
    i < waitingRooms.length;
    i++
  ) {
    const [
      targetRoomId,
      targetRoom,
    ] = waitingRooms[i];

    while (
      targetRoom.players.length < 4
    ) {
      let sourceRoomId = null;
      let sourceRoom = null;

      // Find another waiting room that has players
      for (
        let j = waitingRooms.length - 1;
        j > i;
        j--
      ) {
        const [
          candidateRoomId,
          candidateRoom,
        ] = waitingRooms[j];

        if (
          candidateRoomId !==
            targetRoomId &&
          candidateRoom.players.length >
            0 &&
          candidateRoom.game.phase ===
            "waiting"
        ) {
          sourceRoomId =
            candidateRoomId;

          sourceRoom =
            candidateRoom;

          break;
        }
      }

      if (!sourceRoom) {
        break;
      }

      const player =
        sourceRoom.players.shift();

      targetRoom.players.push(player);

      moves.push({
        playerId: player.id,
        playerName: player.name,
        fromRoomId: sourceRoomId,
        toRoomId: targetRoomId,
      });
    }
  }

  // Delete rooms that became empty
  for (const roomId in rooms) {
    const room = rooms[roomId];

    if (
      room.players.length === 0 &&
      room.game.phase === "waiting"
    ) {
      delete rooms[roomId];
    }
  }

  return moves;
}

// ============================
// FIND AVAILABLE WAITING ROOM
// ============================

function findAvailableWaitingRoom(
  rooms,
  currentRoomId,
) {
  for (const roomId in rooms) {
    if (roomId === currentRoomId) {
      continue;
    }

    const room = rooms[roomId];

    if (
      room.game.phase === "waiting" &&
      room.players.length < 4
    ) {
      return roomId;
    }
  }

  return null;
}

// ============================
// EXPORTS
// ============================

module.exports = {
  findOrCreateRoom,
  getRoom,
  removePlayer,
  deleteRoomIfEmpty,
  findAvailableWaitingRoom,
};