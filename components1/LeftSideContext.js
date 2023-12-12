// LeftSideContext.js

import React, { createContext, useContext, useState } from 'react';

const LeftSideContext = createContext();

export const LeftSideProvider = ({ children }) => {
  const [leftSideContent, setLeftSideContent] = useState('Default Left Side Content');

  return (
    <LeftSideContext.Provider value={{ leftSideContent, setLeftSideContent }}>
      {children}
    </LeftSideContext.Provider>
  );
};

export const useLeftSide = () => {
  const context = useContext(LeftSideContext);
  if (!context) {
    throw new Error('useLeftSide must be used within a LeftSideProvider');
  }
  return context;
};
