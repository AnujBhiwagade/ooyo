function registerVideoHandlers(io, socket) {
  // ============================
  // WEBRTC OFFER
  // ============================

  socket.on("video-offer", ({ target, offer }) => {
    if (!target || !offer) return;

    io.to(target).emit("video-offer", {
      sender: socket.id,
      offer,
    });
  });

  // ============================
  // WEBRTC ANSWER
  // ============================

  socket.on("video-answer", ({ target, answer }) => {
    if (!target || !answer) return;

    io.to(target).emit("video-answer", {
      sender: socket.id,
      answer,
    });
  });

  // ============================
  // ICE CANDIDATE
  // ============================

  socket.on("ice-candidate", ({ target, candidate }) => {
    if (!target || !candidate) return;

    io.to(target).emit("ice-candidate", {
      sender: socket.id,
      candidate,
    });
  });
}

module.exports = {
  registerVideoHandlers,
};