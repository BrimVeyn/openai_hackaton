import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAssistantResponse } from '@/api/openaiService'; // Import API Service
import { Flashcard } from './FlashCard';
import { useVariable } from '../VariablesContext';

export function Chat() {
  const { show, setShow,setContent } = useVariable();
  const [messages, setMessages] = useState([
    { sender: 'Assistant', text: 'Hey ! Give me a topic you would like to learn more about' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // State pour le chargement

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'You', text: userMessage }]);
    setInput(''); // Clear input
    setLoading(true);

    try {
      // Appel API pour obtenir une réponse de l'assistant
      const assistantResponse = await getAssistantResponse(userMessage, setShow,setContent);

      setMessages((prev) => [
        ...prev,
        { sender: 'Assistant', text: assistantResponse },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'Assistant', text: 'An error occurred. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="rounded-xl border bg-card text-card-foreground shadow h-screen w-1/3 flex flex-col">
      <div className="space-y-1.5 p-6 flex flex-row items-center">
        <div className="flex items-center space-x-4">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <img
              className="aspect-square h-full w-full"
              alt = "A"
              src="/avatars/01.png"
            />
          </span>
          <div>
            <p className="text-sm font-medium leading-none">User</p>
            <p className="text-sm text-muted-foreground">user.name@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <ScrollArea className="flex-grow overflow-y-auto p-6 pt-0 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
              msg.sender === 'You'
                ? 'ml-auto bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </ScrollArea>

      {/* Input Section */}
      <div className="flex items-center p-6 pt-0">
        <Input
          className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm flex-1"
          id="message"
          placeholder="Type your message..."
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading} // Disable input when loading
        />
        <Button
          className="inline-flex items-center justify-center bg-primary text-primary-foreground shadow h-9 w-9"
          onClick={handleSendMessage}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22 11 13 2 9 22 2Z"></path>
            </svg>
          )}
        </Button>
      </div>
    </div>
    </>
  );
}
