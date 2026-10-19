
const { randomUUID } = require("crypto");

function registerRandomChatHandlers(io, socket, state) {
  const { partners, names } = state;

  // Always use the shared queue array; never replace its reference.
  function removeFromQueue(socketId) {
    state.queue = state.queue.filter((id) => id !== socketId);
  }

  function endMatch(socketId, notifyPartner = true) {
    const match = partners.get(socketId);
    if (!match) return null;

    partners.delete(socketId);

    const partnerMatch = partners.get(match.partnerId);

    if (partnerMatch?.sessionId === match.sessionId) {
      partners.delete(match.partnerId);

      if (notifyPartner) {
        io.to(match.partnerId).emit("random-chat-partner-left");
      }
    }

    return match;
  }

  function removeStaleQueueEntries() {
    state.queue = state.queue.filter((id) => {
      const candidate = io.sockets.sockets.get(id);

      return candidate?.connected && !partners.has(id);
    });
  }

  function matchWaitingPlayers() {
    removeStaleQueueEntries();

    while (state.queue.length >= 2) {
      const firstId = state.queue.shift();
      const secondId = state.queue.shift();

      const firstSocket = io.sockets.sockets.get(firstId);
      const secondSocket = io.sockets.sockets.get(secondId);

      if (
        !firstSocket?.connected ||
        !secondSocket?.connected ||
        partners.has(firstId) ||
        partners.has(secondId)
      ) {
        if (firstSocket?.connected && !partners.has(firstId)) {
          state.queue.unshift(firstId);
        }

        if (secondSocket?.connected && !partners.has(secondId)) {
          state.queue.unshift(secondId);
        }

        removeStaleQueueEntries();
        continue;
      }

      const sessionId = randomUUID();

      partners.set(firstId, {
        partnerId: secondId,
        sessionId,
      });

      partners.set(secondId, {
        partnerId: firstId,
        sessionId,
      });

      firstSocket.emit("random-chat-matched", {
        sessionId,
        partnerId: secondId,
        partnerName: names.get(secondId) || "Stranger",
      });

      secondSocket.emit("random-chat-matched", {
        sessionId,
        partnerId: firstId,
        partnerName: names.get(firstId) || "Stranger",
      });
    }
  }

  function joinQueue() {
    if (!socket.connected || partners.has(socket.id)) return;

    if (!state.queue.includes(socket.id)) {
      state.queue.push(socket.id);
    }

    socket.emit("random-chat-waiting", {
      message: "Looking for someone to chat with...",
    });

    matchWaitingPlayers();
  }

  function leaveRandomChat() {
    removeFromQueue(socket.id);
    endMatch(socket.id);
    names.delete(socket.id);

    socket.emit("random-chat-left");
  }

  socket.on("random-chat-join", (payload = {}) => {
    const name =
      typeof payload.name === "string"
        ? payload.name.trim().slice(0, 24)
        : "";

    if (!name) {
      socket.emit("random-chat-error", {
        message: "Please enter your name first.",
      });
      return;
    }

    names.set(socket.id, name);
    joinQueue();
  });

  socket.on("random-chat-next", () => {
    const name = names.get(socket.id);

    if (!name) {
      socket.emit("random-chat-error", {
        message: "Please join random chat again.",
      });
      return;
    }

    endMatch(socket.id);
    removeFromQueue(socket.id);
    joinQueue();
  });

  socket.on("random-chat-leave", leaveRandomChat);

  socket.on("random-chat-message", (payload = {}) => {
    const match = partners.get(socket.id);

    if (
      !match ||
      !payload ||
      payload.sessionId !== match.sessionId ||
      typeof payload.text !== "string"
    ) {
      return;
    }

    const text = payload.text.trim().slice(0, 1000);
    if (!text) return;

    const partnerMatch = partners.get(match.partnerId);
    const partnerSocket = io.sockets.sockets.get(match.partnerId);

    // Confirm both sockets still belong to the same session.
    if (
      !partnerSocket?.connected ||
      partnerMatch?.partnerId !== socket.id ||
      partnerMatch?.sessionId !== match.sessionId
    ) {
      endMatch(socket.id);
      return;
    }

    partnerSocket.emit("random-chat-message", {
      sessionId: match.sessionId,
      text,
    });
  });

  socket.on("disconnect", () => {
    removeFromQueue(socket.id);
    endMatch(socket.id);
    names.delete(socket.id);
  });
}

module.exports = { registerRandomChatHandlers };
