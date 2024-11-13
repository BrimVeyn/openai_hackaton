import { Chat } from '@/components/Chat';
import { FlashCardStack } from '@/components/FlashCard';
import { useVariable } from '@/VariablesContext';

function App() {
	const { show, content } = useVariable();
	const hasCards = show && content && JSON.parse(content)?.words.length > 1;

	return (
		<div className="flex h-screen">
			{/* Chat Section */}
			<div className="w-1/3 p-4">
				<Chat />
			</div>

			{/* Empty space if no cards */}
			<div className={`flex-grow ${hasCards ? 'w-2/3' : ''} bg-white flex items-center justify-center`}>
				{hasCards ? (
					<div className="w-full h-full flex items-center justify-center">
						<FlashCardStack />
					</div>
				) : (
						<div className="w-full h-full flex items-center justify-center">
							<p className="text-gray-400 text-xl">No flashcards available yet.</p>
						</div>
					)}
			</div>

		</div>
	);
}

export default App;
