import OpenAI from "openai";
import { Flashcard } from '@/components/FlashCard';
import { useState } from "react";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export function generate_flashcard(args, setShow, setContent) {
	setShow(true);
	setContent(args);
	console.log("Args:", args);
	return true
}

export async function getAssistantResponse(userMessage, setShow, setContent) {
  try {
    
    const assistant = await openai.beta.assistants.retrieve("asst_GyI3Cd5WyjmUpgna5VaIVwfI");
    
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
      instructions: "Je m'appele nathan et j'apprend l'anglais",
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
	  for (let index = 0; index < messages.length; index++) {
	  	const msg = messages[index];
		console.log(msg)
	  	
	  }
      const assistantMessage = messages.data.find((msg) => msg.role === "assistant");
      return assistantMessage.content[0].text.value;
    } else {
		if (run.status === "requires_action") {

				const func = run.required_action.submit_tool_outputs.tool_calls[0].function;
				const funcName = func.name;
				const funcArgs = func.arguments;
				
				console.log("Function", func);
				console.log("Function name", funcName);
				console.log("Function args", funcArgs);

				switch (funcName) {
					case 'generate_flashcard':
						generate_flashcard(funcArgs, setShow,setContent )
						break;
					default:
						break;
				}
			}
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return "An error occurred while communicating with the assistant.";
  }
}
