import { Server as SocketIOServer, Socket } from "socket.io";

const SocketHandler = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("connection");

    socket.on("elementTransform", (data) => {
      socket.broadcast.emit("elementTransform", data);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });
};

export default SocketHandler;
