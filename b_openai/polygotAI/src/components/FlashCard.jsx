import { useVariable } from "../VariablesContext";

export function Flashcard() {
	const { show, content } = useVariable();
	if (show === false)
		return <></>;

	const myflash = JSON.parse(content);

	return (
		<div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
			<h2 className="text-2xl font-bold text-center mb-4">Flashcard</h2>
			<div>
				<h1 className="text-xl font-semibold text-gray-700 mb-4 text-center">
					{myflash["given_subject"]}
				</h1>
				<div className="space-y-4">
					{myflash.words.map((word, index) => (
						<div
							key={index}
							className="bg-gray-100 p-4 rounded-md shadow-sm flex flex-col items-center"
						>
							{/* Word in blue, translated word in gray */}
							<p className="text-lg font-semibold">
								<span className="text-blue-600">{word}</span> / 
								<span className="text-gray-600 ml-1">{myflash.translated_words[index]}</span>
							</p>
							<p className="text-sm text-gray-600 mt-1">
								{myflash.descriptions[index]}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
