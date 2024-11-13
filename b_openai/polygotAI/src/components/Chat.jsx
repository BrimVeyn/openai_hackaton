import { useState } from 'react';
import { ScrollArea } from "shadcn/scroll-area";
import { Input } from "shadcn/input";
import { Button } from "shadcn/button";
import { getAssistantResponse } from '@/api/openaiService';
import { FlashCardStack } from './FlashCard';
import { useVariable } from '../VariablesContext';

export function Chat() {
  const { show, setShow, setContent, content, setCards, addCard } = useVariable();
  const [messages, setMessages] = useState([
    { sender: 'Assistant', text: 'Hey! Give me a topic you would like to learn more about.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'You', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const assistantResponse = await getAssistantResponse(userMessage, setShow, setContent, setCards, addCard);

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



  const hasCards = show && content && JSON.parse(content).words.length > 1;

  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow flex flex-col h-full">
        {/* Header Section - unchanged */}
        <div className="space-y-1.5 p-6 flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <img
                className="aspect-square h-full w-full"
                alt="A"
                src="/avatars/01.png"
              />
            </span>
            <div>
              <p className="text-sm font-medium leading-none">User</p>
              <p className="text-sm text-muted-foreground">user.name@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Messages Section - unchanged */}
        <ScrollArea className="flex-grow overflow-y-auto p-6 pt-0 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${msg.sender === 'You'
                ? 'ml-auto bg-primary text-primary-foreground'
                : 'bg-muted'
                }`}
            >
              {msg.text}
            </div>
          ))}
        </ScrollArea>

        {/* Input Section - added onKeyPress */}
        <div className="flex items-center p-6 pt-0">
          <Input
            className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm flex-1"
            id="message"
            placeholder="Type your message..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            className="ml-2 inline-flex items-center justify-center bg-primary text-primary-foreground shadow h-9 w-9"
            onClick={handleSendMessage}
            disabled={loading}
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
    </div>
  );
}
