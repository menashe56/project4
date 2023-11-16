import React from 'react';
import { WebSocketHandler } from './Interface/WebSocketHandler';
import MainApp from './Interface/MainApp';

export default function App() {
  return ( 
    <WebSocketHandler>
      <MainApp />
    </WebSocketHandler>
  );
};
