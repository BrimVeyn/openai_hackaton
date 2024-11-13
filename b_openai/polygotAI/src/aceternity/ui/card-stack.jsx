"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export const CardStack = ({ items, offset, scaleFactor }) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  const handleNextCard = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()); // Déplace la dernière carte à l'avant
      return newArray;
    });
  };

  return (
    <div
      className="relative h-60 w-60 md:h-60 md:w-96 cursor-pointer"
      onClick={handleNextCard} // Change de carte au clic
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
          style={{
            transformOrigin: "top center",
          }}
          animate={{
            top: index * -CARD_OFFSET,
            scale: 1 - index * SCALE_FACTOR, // Diminue l'échelle pour les cartes derrière
            zIndex: cards.length - index, // Diminue le z-index pour empiler les cartes
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="font-normal text-neutral-700 dark:text-neutral-200">
            {card.content}
          </div>
          <div>
            <p className="text-neutral-500 font-medium dark:text-white">
              {card.name}
            </p>
            <p className="text-neutral-400 font-normal dark:text-neutral-200">
              {card.designation}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
