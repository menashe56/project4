import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

const WebSocketHandler = ({ children }) => {
    const socket = io('http://localhost:3000/expo-app');
  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketHandler, WebSocketContext };
