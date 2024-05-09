import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchTestQuestions, submitTest } from "../../services/candidateServices";

const SkillTestFrame = () => {
  const { skillTestId, applicationId } = useParams();
  const [questionsData, setQuestionsData] = useState([]);
  const [showInstructions, setShowInstructions] = useState(
    localStorage.getItem("showInstructions") !== "false"
  );
  const [sampleInstructions, setSampleInstructions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(localStorage.getItem("currentQuestionIndex")) || 0
  );
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(localStorage.getItem("selectedOptions")) || []
  );
  const [timeLeft, setTimeLeft] = useState(
    parseInt(localStorage.getItem("timeLeft")) || 30
  );
  const [timerRunning, setTimerRunning] = useState(
    localStorage.getItem("timerRunning") === "true"
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [testStarted, setTestStarted] = useState(
    localStorage.getItem("testStarted") === "true"
  );
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTestQuestions(skillTestId);
        setQuestionsData(response.questions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [skillTestId]);

  useEffect(() => {
    const instructions = [
      "Read each question carefully before answering.",
      "Ensure you understand the instructions for each question.",
      "Manage your time wisely; allocate time for each question.",
      "Do not spend too much time on any single question.",
      "Review your answers before submitting the test.",
      "Stay focused and avoid distractions during the test.",
      "If you're unsure about an answer, make an educated guess.",
      "Double-check your responses to ensure accuracy.",
      "Use all available resources to aid in answering questions.",
    ];

    const getRandomInstructions = (arr, n) => {
      const shuffled = arr.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    };

    setSampleInstructions(getRandomInstructions(instructions, 5));
  }, []);

  useEffect(() => {
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("timerRunning", timerRunning);
    localStorage.setItem("testStarted", testStarted);
    localStorage.setItem("showInstructions", showInstructions);
    localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
  }, [
    currentQuestionIndex,
    timeLeft,
    timerRunning,
    testStarted,
    showInstructions,
    selectedOptions,
  ]);

  const startTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
    setTimerRunning(true);
  };

  const cancelTest = () => {
    setShowInstructions(true);
    setTestStarted(false);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timerRunning, timeLeft]);

  const handleNextQuestion = () => {
    if (isOptionSelected) {
      if (currentQuestionIndex + 1 < questionsData.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimeLeft(30);
        setIsOptionSelected(false);
      } else {
        setShowSubmitModal(true);
        setTimerRunning(false);
      }
    } else {
      // Add a message or alert to inform the user to select an option
      alert("Please select an option before proceeding.");
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    for (let i = 0; i < questionsData.length; i++) {
      if (
        selectedOptions[i] ===
        questionsData[i].options[questionsData[i].correctAnswer]
      ) {
        correctCount++;
      }
    }
    const calculatedScore = (correctCount / questionsData.length) * 100;
    setScore(calculatedScore);
    return calculatedScore;
  };

  useEffect(() => {
    if (selectedOptions.length === questionsData.length) {
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
    }
  }, [selectedOptions]);

  const handleSubmitTest = async () => {
    try {
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("timerRunning");
      localStorage.removeItem("testStarted");
      localStorage.removeItem("showInstructions");
      localStorage.removeItem("selectedOptions");
      const calculatedScore = calculateScore();
      const response = await submitTest(
        {
          answers: selectedOptions,
          score: calculatedScore,
          applicationId: applicationId,
        }
      );
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  const handleChangeOption = (option) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestionIndex] = option;
    setSelectedOptions(updatedOptions);
    setIsOptionSelected(true);
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
    setTimerRunning(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Skill Test</h1>
      {submissionSuccess ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <p className="text-xl font-semibold text-center">
            Test Submitted Successfully
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 relative">
          {!showInstructions &&
          testStarted &&
          questionsData.length > 0 &&
          currentQuestionIndex < questionsData.length ? (
            <>
              <div className="mb-6">
                <p className="text-right text-sm">Time Left: {timeLeft} sec</p>
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  {questionsData[currentQuestionIndex].question}
                </h2>
                <div className="space-y-2">
                  {questionsData[currentQuestionIndex].options.map(
                    (option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`option${index}`}
                          name="options"
                          value={option}
                          checked={
                            selectedOptions[currentQuestionIndex] === option
                          }
                          onChange={() => handleChangeOption(option)}
                          className="mr-2 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`option${index}`}
                          className="select-none"
                        >
                          {option}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div></div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleNextQuestion}
                  disabled={!isOptionSelected}
                >
                  {currentQuestionIndex + 1 < questionsData.length
                    ? "Next"
                    : "Submit"}
                </button>
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Instructions for the test:
              </h2>
              <ul className="list-disc pl-6 mb-4">
                {sampleInstructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={startTest}
                >
                  Start Test
                </button>
                {/* <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={cancelTest}
                >
                  Cancel
                </button> */}
              </div>
            </div>
          )}
          {showSubmitModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4">
                  Are you sure you want to submit the test?
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                    onClick={handleSubmitTest}
                  >
                    Submit
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={handleCancelSubmit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillTestFrame;
