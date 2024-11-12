import { Chat } from '@/components/Chat';

function App() {
  return (
    <div className="flex">
      <Chat />
      <div className="flex-grow bg-gray-100"></div> {/* Espace vide à droite */}
    </div>
  );
}

export default App;
