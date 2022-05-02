import { ReactChild, createContext } from "react";
import io from 'socket.io-client'

const socket = io("ws://localhost:3000");
export const SocketContext = createContext(socket);

interface ISocketProvider {
  children: ReactChild;
}

export const SocketProvider = (props: ISocketProvider) => (
  <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
);
