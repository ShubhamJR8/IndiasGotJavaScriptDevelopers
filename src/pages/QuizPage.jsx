import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const questionsData = [
  {
    question: "What is the output of `console.log(1 + '1');`?",
    options: ["11", "2", "Error", "NaN"],
    correctAnswer: "11",
    type: "MCQ",
    topic: "javascript",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    question: "Which of the following is a valid TypeScript type?",
    options: ["string", "text", "char", "character"],
    correctAnswer: "string",
    type: "MCQ",
    topic: "typescript",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    question: "What is the purpose of TypeScript generics?",
    options: [
      "To create reusable components",
      "To define a variable type",
      "To override types",
      "To remove type safety",
    ],
    correctAnswer: "To create reusable components",
    type: "MCQ",
    topic: "typescript",
    difficulty: "medium",
    timeLimit: 45,
  },
  {
    question: "What hook is used to manage state in a functional component?",
    options: ["useState", "useEffect", "useReducer", "useMemo"],
    correctAnswer: "useState",
    type: "MCQ",
    topic: "react",
    difficulty: "medium",
    timeLimit: 45,
  },
  {
    question: "What is the correct way to use useEffect with an empty dependency array?",
    options: ["useEffect(() => {}, [])", "useEffect(() => {})", "useEffect([])"],
    correctAnswer: "useEffect(() => {}, [])",
    type: "MCQ",
    topic: "react",
    difficulty: "hard",
    timeLimit: 60,
  },
  {
    question: "Which module in Node.js is used for file system operations?",
    options: ["fs", "http", "path", "url"],
    correctAnswer: "fs",
    type: "MCQ",
    topic: "node",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    question: "Which middleware is used to parse JSON request bodies in Express.js?",
    options: ["express.json()", "body-parser", "json-parser", "parse-json"],
    correctAnswer: "express.json()",
    type: "MCQ",
    topic: "node",
    difficulty: "medium",
    timeLimit: 45,
  },
];

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const filteredQuestions = questionsData.filter(
    (q) => q.topic.toLowerCase() === topic.toLowerCase()
  );
  const currentQuestion = filteredQuestions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
      clearTimeout(timerRef.current); // Clear any previous timer
      timerRef.current = setTimeout(() => {
        handleNext();
      }, currentQuestion.timeLimit * 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  if (!currentQuestion) {
    return <div className="text-white text-center mt-10">No questions available for this topic.</div>;
  }

  const handleAnswer = (answer) => {
    if (!selectedAnswer) {
      setSelectedAnswer(answer);
      if (answer === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
      }
      clearTimeout(timerRef.current); // Stop the timer once the user answers
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      navigate("/result", { state: { score, total: filteredQuestions.length } });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-teal-400"
      >
        {topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 p-6 bg-gray-800 rounded-xl shadow-lg w-3/4 text-center"
      >
        <h2 className="text-2xl font-semibold">{currentQuestion.question}</h2>
        <p className="text-red-400 font-bold">Time Left: {timeLeft}s</p>
      </motion.div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-3/4">
        {currentQuestion.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(option)}
            className={`p-4 rounded-lg font-semibold transition-all duration-300 text-lg text-center shadow-md ${
              selectedAnswer === option
                ? option === currentQuestion.correctAnswer
                  ? "bg-green-500"
                  : "bg-red-500"
                : "bg-gray-800 hover:bg-teal-600"
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="mt-6 px-8 py-3 bg-teal-500 text-white text-lg font-semibold rounded-lg hover:bg-teal-600 transition-all"
        disabled={!selectedAnswer && timeLeft > 0} // Prevent skipping without answering
      >
        {currentIndex < filteredQuestions.length - 1 ? "Next Question" : "Submit Quiz"}
      </button>
    </div>
  );
};

export default QuizPage;
