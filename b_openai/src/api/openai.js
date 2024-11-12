import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

async function main() {
  try {
		const assistant = await openai.beta.assistants.retrieve(
			"asst_GyI3Cd5WyjmUpgna5VaIVwfI"
		);


		const thread = await openai.beta.threads.create();

		const message = await openai.beta.threads.messages.create(thread.id, {
			role: "user",
			content: "Give me three words I might not know in English"
		});

		console.log("Assistant: ", assistant)
		console.log("Thread: ", thread)
		console.log("Message: ", message)

		let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
			assistant_id: assistant.id,
			instructions: "Please address the user as Jane Doe. The user has a premium account."
		});

		console.log("Run: ", run)

		if (run.status === "completed") {
			const messages = await openai.beta.threads.messages.list(run.thread_id);
			for (const message of messages.data.reverse()) {
				console.log(`${message.role} > ${message.content[0].text.value}`);
			}
		} else {
			console.log(run.status);
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

main();
