import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export async function getAssistantResponse(userMessage) {
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
      const assistantMessage = messages.data.find((msg) => msg.role === "assistant");
      return assistantMessage.content[0].text.value;
    } else {
      return "Sorry, the assistant could not complete your request.";
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return "An error occurred while communicating with the assistant.";
  }
}
