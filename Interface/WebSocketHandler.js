import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

const WebSocketHandler = ({ children }) => {
  const socket = io('http://13.49.46.202/expo-app');

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketHandler, WebSocketContext };
