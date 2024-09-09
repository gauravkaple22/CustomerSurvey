import React, { useState } from "react";
import "./survey.css";

const questions = [
  { id: 1, question: "How satisfied are you with our products?", type: "rating", scale: 5 },
  { id: 2, question: "How fair are the prices compared to similar retailers?", type: "rating", scale: 5 },
  { id: 3, question: "How satisfied are you with the value for money of your purchase?", type: "rating", scale: 5 },
  { id: 4, question: "On a scale of 1-10 how would you recommend us to your friends and family?", type: "rating", scale: 10 },
  { id: 5, question: "What could we do to improve our service?", type: "text" }
];

const SurveyApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [sessionId] = useState(new Date().getTime());

  const currentQuestion = currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;

  const handleAnswerChange = (value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setCompleted(true);
    const dataToStore = {
      sessionId,
      answers,
      status: "COMPLETED",
    };
    localStorage.setItem(`survey-${sessionId}`, JSON.stringify(dataToStore));

    setTimeout(() => {
      setCompleted(false);
      setCurrentQuestionIndex(null);
      setAnswers({});
    }, 5000);
  };

  const renderWelcomeScreen = () => (
    <div className="welcome-screen">
      <h2 className="text-3xl font-bold mb-4 text-blue-600">Welcome to our Survey</h2>
      <p className="text-lg mb-6 text-gray-600">Please press the start button to begin.</p>
      <button
        onClick={() => setCurrentQuestionIndex(0)}
        className="start-button"
      >
        Start
      </button>
    </div>
  );

  const renderQuestionScreen = () => (
    <div className="question-screen">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">{currentQuestion.question}</h2>
      {currentQuestion.type === "rating" ? (
        <div className={`rating-buttons ${currentQuestion.scale === 10 ? "scale-10" : "scale-5"}`}>
          {Array.from({ length: currentQuestion.scale }, (_, index) => (
            <div
              key={index}
              className={`rating-circle ${
                answers[currentQuestion.id] === index + 1 ? 'selected' : ''
              }`}
              onClick={() => handleAnswerChange(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      ) : (
        <textarea
          value={answers[currentQuestion.id] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="text-area"
          rows="4"
        />
      )}
      <div className="navigation-buttons">
        <button
          onClick={handlePrev}
          className={`prev-button ${currentQuestionIndex === 0 ? "disabled" : ""}`}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <p className="question-info">{`Question ${currentQuestionIndex + 1} / ${questions.length}`}</p>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="next-button"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="submit-button"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );

  const renderCompletionScreen = () => (
    <div className="completion-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Thank you for your time!</h1>
      <p className="text-gray-500">Redirecting to the welcome screen...</p>
    </div>
  );

  return (
    <div className="main-container">
      {completed ? renderCompletionScreen() : currentQuestionIndex === null ? renderWelcomeScreen() : renderQuestionScreen()}
    </div>
  );
};

export default SurveyApp;