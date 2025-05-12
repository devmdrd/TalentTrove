module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ roomId, message }) => {
      io.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {});
  });
};