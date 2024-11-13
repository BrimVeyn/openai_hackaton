import { Chat } from '@/components/Chat';
import { Flashcard } from '@/components/FlashCard';

function App() {
  return (
    <div className="flex">
      <Chat />
      <div className="flex-grow bg-gray-100"></div> {/* Empty space */}
      <div className="w-1/4 p-4 bg-gray-100"> {/* Flashcard container */}
        <Flashcard />
      </div>
    </div>
  );
}

export default App;
