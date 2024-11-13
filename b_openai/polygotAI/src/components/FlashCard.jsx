// "use client";
import React, { useEffect, useState } from 'react';
import { CardStack } from "aceternity/card-stack";
import { useVariable } from "../VariablesContext";

const FlashCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // Stop event from bubbling up to CardStack
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative w-full h-64"
      onClick={handleClick}
      style={{ pointerEvents: 'auto' }} // Ensure clicks are captured
    >
      <div
        className={`absolute w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
      >
        {/* Front side - Description */}
        <div className="absolute w-full h-full p-6 bg-white rounded-lg shadow-lg [backface-visibility:hidden] cursor-pointer">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-800 text-center">{card.description}</p>
          </div>
        </div>

        {/* Back side - Word and Translation */}
        <div className="absolute w-full h-full p-6 bg-white rounded-lg shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] cursor-pointer">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{card.word}</h3>
            <p className="text-lg text-gray-600">{card.translation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function FlashCardStack() {
  const { cards, setCards } = useVariable();
  // useEffect(() => {

  // setCards(cards.map((card, cardIndex) => ({
  //   id: `card-${cardIndex}`, // Unique id for each card
  //   content: <FlashCard key={card.id || cardIndex} card={card} />,
  // })));
  console.log('got changement on cards', cards);
  // }, [cards]);
  console.log("CARDDS", cards);

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="relative perspective-[1000px]" style={{ touchAction: 'none' }}>
        <CardStack
          key={JSON.stringify(cards)} // Force re-render when cards change
          items={cards.map((card, cardIndex) => ({
            id: `card-${cardIndex}`, // Unique id for each card
            content: <FlashCard key={card.id || cardIndex} card={card} />,
          }))}
          onVote={(item) => {
            // Prevent default CardStack behavior if needed
            return false;
          }}
        />
      </div>
    </div>
  );
}
