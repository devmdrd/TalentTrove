module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (message, recipientId) => {
      try {
        if (!message || typeof message.content !== "string") {
          throw new Error("Invalid message format");
        }

        if (recipientId) {
          io.to(recipientId).emit("message", message);
        } else {
          io.emit("message", message);
        }
      } catch (error) {
        console.error("Error handling message:", error.message);
        socket.emit("errorMessage", { error: error.message });
      }
    });

    socket.on("joinRoom", (roomId) => {
      try {
        socket.join(roomId);
      } catch (error) {
        console.error("Error joining room:", error.message);
        socket.emit("errorMessage", { error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
