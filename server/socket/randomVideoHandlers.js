
function registerRandomVideoHandlers(io, socket, state) {
  function getValidPartner(sessionId) {
    const match = state.partners.get(socket.id);

    if (!match || match.sessionId !== sessionId) {
      return null;
    }

    const partnerMatch = state.partners.get(match.partnerId);

    if (
      !partnerMatch ||
      partnerMatch.partnerId !== socket.id ||
      partnerMatch.sessionId !== sessionId
    ) {
      return null;
    }

    const partnerSocket = io.sockets.sockets.get(match.partnerId);

    if (!partnerSocket?.connected) {
      return null;
    }

    return {
      partnerId: match.partnerId,
      partnerSocket,
    };
  }

  // WebRTC offer
  socket.on("random-video-offer", (payload = {}) => {
    const { sessionId, offer } = payload;

    if (!sessionId || !offer) return;

    const partner = getValidPartner(sessionId);
    if (!partner) return;

    partner.partnerSocket.emit("random-video-offer", {
      sessionId,
      sender: socket.id,
      offer,
    });
  });

  // WebRTC answer
  socket.on("random-video-answer", (payload = {}) => {
    const { sessionId, answer } = payload;

    if (!sessionId || !answer) return;

    const partner = getValidPartner(sessionId);
    if (!partner) return;

    partner.partnerSocket.emit("random-video-answer", {
      sessionId,
      sender: socket.id,
      answer,
    });
  });

  // ICE candidate
  socket.on("random-video-ice-candidate", (payload = {}) => {
    const { sessionId, candidate } = payload;

    if (!sessionId || !candidate) return;

    const partner = getValidPartner(sessionId);
    if (!partner) return;

    partner.partnerSocket.emit("random-video-ice-candidate", {
      sessionId,
      sender: socket.id,
      candidate,
    });
  });
}

module.exports = { registerRandomVideoHandlers };
