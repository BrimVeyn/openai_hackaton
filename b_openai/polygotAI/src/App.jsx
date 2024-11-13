import { Chat } from '@/components/Chat';
import { FlashCardStack } from '@/components/FlashCard';
import { CardGame } from '@/components/CardGame';
import { useVariable } from '@/VariablesContext';
import Header from './components/Hearder';

function App() {
    const { show, content, showGame } = useVariable();
    const hasCards = show && content && JSON.parse(content)?.words.length > 1;

    return (
        <div className="flex h-screen">
            {/* Chat Section - 1/3 width */}
            <div className="w-1/3 p-4">
                <Chat />
            </div>

            {/* Main Content Section - 2/3 width */}
            <div className="w-2/3 flex flex-col">
                {/* Header */}
                <Header />

                {/* Content Area */}
                <div className={`flex-grow ${hasCards || showGame ? '' : ''} bg-white flex items-center justify-center`}>
                    {showGame ? (
                        // Show CardGame if showGame is true
                        <div className="w-full h-full flex items-center justify-center">
                            <CardGame />
                        </div>
                    ) : hasCards ? (
                        // Show FlashCardStack if there are cards
                        <div className="w-full h-full flex items-center justify-center">
                            <FlashCardStack />
                        </div>
                    ) : (
                        // Show a message if no flashcards are available
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-400 text-xl">No flashcards available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default App;
