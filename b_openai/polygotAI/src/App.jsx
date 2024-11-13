import { Chat } from '@/components/Chat';
import { FlashCardStack } from '@/components/FlashCard';
import { useVariable } from '@/VariablesContext';
import Header from './components/Hearder';

function App() {
	const { show, content } = useVariable();
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
        <div className="flex-grow flex items-center justify-center">
            {hasCards ? (
                <FlashCardStack />
            ) : (
                <p className="text-gray-400 text-xl text-center">
                    No flashcards available yet.
                </p>
            )}
        </div>
    </div>
</div>
	);
}

export default App;
