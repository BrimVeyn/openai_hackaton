// import React, { createContext, useState, useContext } from 'react';

// // Create the context
// const VariableContext = createContext();

// // Create a provider component
// export default function VariableProvider({ children }) {
//   const [show, setShow] = useState(false);
//   const [content, setContent] = useState(null);
//   const [cards, setCards] = useState([]); // Défini correctement

//   return (
//     <VariableContext.Provider value={{ show, setShow, content, setContent, cards, setCards }}>
//       {children}
//     </VariableContext.Provider>
//   );
// }

// // Custom hook for consuming the VariableContext
// export function useVariable() {
//   const context = useContext(VariableContext);
//   if (context === undefined) {
//     throw new Error('useVariable must be used within a VariableProvider');
//   }
//   return context;
// }


// VariablesContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const VariableContext = createContext();

// Create a provider component
export default function VariableProvider({ children }) {
  const [show, setShow] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [content, setContent] = useState(null);
  const [contentGame, setContentGame] = useState(null);
  const [cards, setCards] = useState([]); // Défini correctement
  return (
    <VariableContext.Provider value={{ show, setShow, showGame, setShowGame, contentGame, setContentGame, content, setContent, cards, setCards }}>
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
