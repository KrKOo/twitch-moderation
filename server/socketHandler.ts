import { Server as SocketIOServer, Socket } from "socket.io";

const SocketHandler = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("connection");

    socket.on("message", (msg) => {
      socket.broadcast.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });
};

export default SocketHandler;
