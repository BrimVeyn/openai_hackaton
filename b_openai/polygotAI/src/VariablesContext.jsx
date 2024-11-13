import React, { createContext, useState, useContext } from 'react';

// Create the context
const VariableContext = createContext();

// Create a provider component
export default function VariableProvider({ children }) {
  const [show, setShow] = useState(false); // Add your initial state or replace `null` with initial value
  const [content, setContent] = useState(null); // Add your initial state or replace `null` with initial value

  return (
    <VariableContext.Provider value={{ show, setShow, content, setContent }}>
      {children}
    </VariableContext.Provider>
  );
}

// Custom hook for consuming the VariableContext
export function useVariable() {
  const context = useContext(VariableContext);
  if (context === undefined) {
    throw new Error('useVariable must be used within a VariableProvider');
  }
  return context;
}
