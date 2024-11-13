import WebSocket from "ws";
import dotenv from "dotenv";
import record from "node-record-lpcm16";
import Speaker from "speaker";

dotenv.config();

var ws = null;

function initConversation() {
	const apiKey = process.env.VITE_OPENAI_API_KEY; // Assurez-vous que la clé est correctement chargée

	const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
	ws = new WebSocket(url, {
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"OpenAI-Beta": "realtime=v1",
		},
	});

	ws.on("open", handleOpen);
	ws.on("message", handleMessage);
	ws.on("error", (error) => console.error("Erreur WebSocket :", error));
	ws.on("close", () => console.log("Connexion fermée."));
}

async function handleOpen() {
	console.log("Connexion établie. Parlez maintenant !");
	await startConversationLoop();  // Commence la boucle de conversation
}

async function startConversationLoop() {
	try {
		// Enregistrement audio et conversion en Base64
		const base64AudioData = await startRecording();

		// Créer et envoyer l'événement de message
		const createConversationEvent = {
			type: "conversation.item.create",
			item: {
				type: "message",
				role: "user",
				content: [
					{
						type: "input_audio",
						audio: base64AudioData,
					},
				],
			},
		};
		ws.send(JSON.stringify(createConversationEvent));

		// Demander une réponse en texte et en audio
		const createResponseEvent = {
			type: "response.create",
			response: {
				modalities: ["text", "audio"],
				instructions: "Please respond with voice output.",
			},
		};
		ws.send(JSON.stringify(createResponseEvent));
	} catch (error) {
		console.error("Erreur lors de l'envoi du message :", error);
	}
}

async function handleMessage(messageStr) {
	const message = JSON.parse(messageStr);

	switch (message.type) {
		case "response.audio.delta":
			// Lecture de l'audio reçu
			const audioBuffer = Buffer.from(message.delta, "base64");
			speaker.write(audioBuffer);
			break;
		case "response.audio.done":
			// Fin de la réponse audio, redémarre la boucle
			speaker.end();
			await startConversationLoop();  // Redémarre l'enregistrement et la conversation
			break;
		case "response.content_part.done":
			// Affiche la transcription si elle est reçue
			console.log("Transcription :", message.part.transcript);
			break;
		default:
			console.log("Message reçu :", message);
			break;
	}
}

function startRecording() {
	return new Promise((resolve, reject) => {
		console.log("Parlez pour envoyer un message à l'assistant. Appuyez sur Entrée pour arrêter l'enregistrement.");

		const audioData = [];
		const recordingStream = record.record({
			sampleRate: 16000,
			threshold: 0,
			verbose: false,
			recordProgram: "sox",
		});

		// Capture des données audio
		recordingStream.stream().on("data", (chunk) => {
			audioData.push(chunk);
		});

		recordingStream.stream().on("error", (err) => {
			console.error("Erreur lors de l'enregistrement :", err);
			reject(err);
		});

		// Arrêt de l'enregistrement au clic sur Entrée
		process.stdin.resume();
		process.stdin.on("data", () => {
			console.log("Enregistrement terminé.");
			recordingStream.stop(); // Arrête l'enregistrement
			process.stdin.pause(); // Stoppe l'écoute
			const audioBuffer = Buffer.concat(audioData);
			const base64Audio = audioBuffer.toString("base64");
			resolve(base64Audio); // Retourne l'audio en Base64
		});
	});
}

// Configuration de la sortie audio pour lire la réponse de GPT
const speaker = new Speaker({
	channels: 1,
	bitDepth: 16,
	sampleRate: 24000,
});

initConversation();
