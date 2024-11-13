"use client";
import { CardStack } from "aceternity/card-stack";
import { useVariable } from "../VariablesContext";

const cards_stack = []; // Tableau global pour stocker plusieurs tas

export function FlashCardStack() {
  const { cards } = useVariable();

  // Ajouter un nouveau tas uniquement s'il est non vide et unique
  if (cards && cards.length > 0) {
    const exists = cards_stack.some(
      (stack) => JSON.stringify(stack) === JSON.stringify(cards)
    );
    if (!exists) {
      cards_stack.push(cards);
    }
  }

  // Vérifie si aucun tas n'existe
  if (cards_stack.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
      {cards_stack.map((stack, stackIndex) => (
        <div
          key={stackIndex}
        >
          <CardStack
            items={stack.map((card, cardIndex) => ({
              id: `${stackIndex}-${cardIndex}`,
              name: card.word,
              designation: card.translation,
              content: <p>{card.description}</p>,
            }))}
          />
        </div>
      ))}
    </div>
  );
}
