import { SocketContext } from "contexts/socketContext";
import { useContext } from "react";

export const useSocket = () => {
  const socket = useContext(SocketContext);

  return socket;
};
