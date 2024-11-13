import React, { useState, useEffect } from "react";
import { useVariable } from "../VariablesContext";
import { Card, Row, Col, Typography, message } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const { Text } = Typography;

// Fisher-Yates shuffle algorithm for better shuffling
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function CardGame() {
  const { setShow, setShowGame, contentGame } = useVariable();
  const [selectedWords, setSelectedWords] = useState([]);
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [categories, setCategories] = useState({});
  const [flashIncorrect, setFlashIncorrect] = useState(false);

  // Initialize categories and remaining words from contentGame
  useEffect(() => {
    if (contentGame && contentGame.topics) {
      const parsedCategories = {};
      let wordsList = [];

      contentGame.topics.forEach((topic) => {
        const topicName = topic.topic_name;
        const words = topic.words.map((wordObj) => wordObj.word);
        parsedCategories[topicName] = words;
        wordsList = wordsList.concat(words);
      });

      setCategories(parsedCategories);
      setRemainingWords(shuffleArray(wordsList)); // Shuffle words before setting them
    }
  }, [contentGame]);

  // Check if the selected words match any category
  const checkCategoryMatch = () => {
    for (const [category, words] of Object.entries(categories)) {
      if (selectedWords.every((word) => words.includes(word))) {
        // Use a functional update to ensure no duplicate categories
        setMatchedCategories((prev) => {
          if (!prev.some((cat) => cat.category === category)) {
            const updatedCategories = [
              ...prev,
              { category, words: [...selectedWords] },
            ];

            // Check if game is complete
            if (Object.keys(categories).length === updatedCategories.length) {
              // End the game
              setShow(true);
              setShowGame(false);
              return prev; // Return early to prevent further updates
            }

            return updatedCategories;
          }
          return prev; // Return unchanged if already matched
        });
        return true;
      }
    }
    return false;
  };

  // Handle word selection
  const handleWordClick = (word) => {
    // If the word is already matched, ignore the click
    if (
      selectedWords.includes(word) ||
      matchedCategories.some((cat) => cat.words.includes(word))
    )
      return;

    setSelectedWords((prev) => {
      const isSelected = prev.includes(word);
      const updatedSelection = isSelected
        ? prev.filter((w) => w !== word)
        : [...prev, word];
      return updatedSelection;
    });
  };

  // UseEffect to check for category match after selectedWords state update
  useEffect(() => {
    if (selectedWords.length === 4) {
      if (checkCategoryMatch()) {
        // Clear the selected words after confirming match
        setTimeout(() => setSelectedWords([]), 100);
        message.success("Good job! You found a matching category.");
      } else {
        // Flash red for incorrect selection and reset
        setFlashIncorrect(true);
        message.error("Incorrect selection! Try again.");
        setTimeout(() => {
          setFlashIncorrect(false);
          setSelectedWords([]);
        }, 800);
      }
    }
  }, [selectedWords]);

  // Display top row for matched categories
  const matchedCategoryDisplay = (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {matchedCategories.map((cat, index) => (
        <Col key={index} xs={24} sm={12} md={6}>
          <Card
            title={
              <span>
                <CheckCircleTwoTone twoToneColor="#52c41a" /> {cat.category}
              </span>
            }
            bordered={false}
            style={{ textAlign: "center" }}
          >
            {cat.words.map((word, idx) => (
              <Text key={idx} style={{ display: "block" }}>
                {word}
              </Text>
            ))}
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Display 4x4 grid for remaining words
  const wordGrid = (
    <Row gutter={[16, 16]}>
      {remainingWords.map((word, index) => {
        const isSelected = selectedWords.includes(word);
        const isMatched = matchedCategories.some((cat) =>
          cat.words.includes(word)
        );

        return (
          <Col key={index} xs={12} sm={8} md={6}>
            <Card
              hoverable={!isMatched}
              onClick={() => handleWordClick(word)}
              style={{
                backgroundColor: isMatched
                  ? "#f6ffed"
                  : isSelected
                  ? "#e6f7ff"
                  : "#fff",
                borderColor:
                  flashIncorrect && isSelected ? "#ff4d4f" : "#d9d9d9",
                cursor: isMatched ? "default" : "pointer",
                textAlign: "center",
              }}
            >
              <Text
                strong={isSelected || isMatched}
                style={{
                  color: isMatched ? "#52c41a" : "inherit",
                  fontSize: 16,
                }}
              >
                {word}
              </Text>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <div className="card-game" style={{ padding: 24 }}>
      {matchedCategoryDisplay}
      {wordGrid}
    </div>
  );
}
