import OpenAI from "openai";
import { useState } from "react";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

// export function generate_flashcard(args, setShow, setContent, setCards) {
//   try {
//     setShow(true);
//     setContent(args); // Optional if you still want to store raw args

//     const flashcards = JSON.parse(args); // Assurez-vous que `args` est une chaîne JSON valide

//     const cards = flashcards.words.map((word, index) => ({
//       word,
//       translation: flashcards.translated_words[index],
//       description: flashcards.descriptions[index],
//     }));

//     setCards(cards); // Mise à jour de la pile de cartes
//   } catch (error) {
//     console.error("Error generating flashcard:", error);
//   }
// }

export function generate_flashcard(args, setShow, setContent, setCards, setShowGame) {
  try {
    setShowGame(false);
    setShow(true);
    setContent(args); // Optional if you still want to store raw args

    const flashcards = JSON.parse(args); // Ensure `args` is a valid JSON string

    const cards = flashcards.words.map((word, index) => ({
      word,
      translation: flashcards.translated_words[index],
      description: flashcards.descriptions[index],
    }));
    console.log("in generate flashcard ", cards);
    console.log("in generate flashcard 1", cards[0]);
    setShow(true);
    // setCards((prevCards) => [...prevCards, cards[0]]);
    // setCards(cards); // Replace the current stack of cards
    //
    setCards(cards);
  } catch (error) {
    console.error("Error generating flashcard:", error);
  }
}

export function play_card_game(args, setShow, setShowGame, setContentGame) {
  try {
    setShow(false);
    setShowGame(true);

    const game_content = JSON.parse(args);

    setContentGame(game_content);
  } catch (error) {
    console.error("Error starting game: ", error);
  }
}


export async function getAssistantResponse(userMessage, setShow, setContent, setCards, setShowGame, setContentGame) {
  try {
    const assistant = await openai.beta.assistants.retrieve("asst_GyI3Cd5WyjmUpgna5VaIVwfI");
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
      instructions: "Je m'appelle Nathan et j'apprends l'anglais",
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const assistantMessage = messages.data.find((msg) => msg.role === "assistant");
      return assistantMessage.content[0].text.value;
    } else if (run.status === "requires_action") {
      const func = run.required_action.submit_tool_outputs.tool_calls[0].function;
      const funcName = func.name;
      const funcArgs = func.arguments;

      console.log("Function", func);
      console.log("Function name", funcName);
      console.log("Function args", funcArgs);
      switch (funcName) {
        case 'generate_flashcard':
          await generate_flashcard(funcArgs, setShow, setContent, setCards, setShowGame);
          return "generate_flashcard()"
          break;
        case 'play_card_game':
          await play_card_game(funcArgs, setShow, setShowGame, setContentGame);
          return "play_card_game()"
        default:
          break;
      }
    }
  }
  catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return "An error occurred while communicating with the assistant.";
  }
}