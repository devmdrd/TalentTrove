module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Listen for messages from clients
    socket.on("message", (message, recipientId) => {
      try {
        console.log("Message received:", message);
        // Basic validation
        if (!message || !message.content || typeof message.content !== "string") {
          throw new Error("Invalid message format");
        }
        // Emit the message to the specific recipient
        // io.to(recipientId).emit("message", message);
        io.emit('message', message);
      } catch (error) {
        console.error("Error handling message:", error.message);
        // Handle the error (e.g., notify the sender)
        socket.emit("errorMessage", { error: error.message });
      }
    });

    // Join a room based on the recipientId when a user selects a recipient
    socket.on("joinRoom", (recipientId) => {
      try {
        console.log("User joined room:", recipientId);
        socket.join(recipientId);
      } catch (error) {
        console.error("Error joining room:", error.message);
        // Handle the error (e.g., notify the user)
        socket.emit("errorMessage", { error: error.message });
      }
    });

    // Listen for disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
