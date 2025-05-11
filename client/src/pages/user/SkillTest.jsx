import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

const SkillTest = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState({ testName: "", timeLimit: 0, questions: [] });
  const [showInstructions, setShowInstructions] = useState(() => localStorage.getItem("showInstructions") !== "false");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => parseInt(localStorage.getItem("currentQuestionIndex")) || 0);
  const [selectedOptions, setSelectedOptions] = useState(() => JSON.parse(localStorage.getItem("selectedOptions")) || []);
  const [timeLeft, setTimeLeft] = useState(() => parseInt(localStorage.getItem("timeLeft")) || 0);
  const [timerRunning, setTimerRunning] = useState(() => localStorage.getItem("timerRunning") === "true");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [testStarted, setTestStarted] = useState(() => localStorage.getItem("testStarted") === "true");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sampleInstructions, setSampleInstructions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/skill-test/${applicationId}`);
        setTestData({
          testName: data.skillTest.testName,
          timeLimit: data.skillTest.timeLimit,
          questions: data.skillTest.questions,
        });

        if (!localStorage.getItem("timeLeft") && !testStarted) {
          setTimeLeft(data.skillTest.timeLimit * 60);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching test data:", err);
        setError("Failed to load test. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  useEffect(() => {
    if (testData.testName) {
      const instructions = [
        `Test Name: ${testData.testName}`,
        `Total Questions: ${testData.questions.length}`,
        `Time Limit: ${testData.timeLimit} minutes`,
        "Read each question carefully before answering.",
        "You have limited time for the entire test.",
        "You can navigate between questions using the navigation buttons.",
        "The test will auto-submit when time expires.",
        "Once submitted, you cannot retake the test.",
        "Ensure you have a stable internet connection.",
        "Do not refresh the page during the test.",
        "All questions are mandatory to attempt.",
      ];
      setSampleInstructions(instructions);
    }
  }, [testData]);

  useEffect(() => {
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
  }, [currentQuestionIndex, selectedOptions]);

  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("timerRunning", timerRunning);
    localStorage.setItem("testStarted", testStarted);
    localStorage.setItem("showInstructions", showInstructions);
  }, [timeLeft, timerRunning, testStarted, showInstructions]);

  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setShowSubmitModal(true);
      setTimerRunning(false);
    }
    return () => clearTimeout(timer);
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    const testSubmitted = localStorage.getItem("testSubmitted");
    if (testSubmitted === "true") {
      setSubmissionSuccess(true);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (timerRunning && !submissionSuccess) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your test progress will be lost.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [timerRunning, submissionSuccess]);

  const startTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
    setTimerRunning(true);
    if (!timeLeft && testData.timeLimit) {
      setTimeLeft(testData.timeLimit * 60);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] !== undefined) {
      if (currentQuestionIndex + 1 < testData.questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setShowSubmitModal(true);
        setTimerRunning(false);
      }
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      await api.post(`/skill-test/${applicationId}/submit`, { answers: selectedOptions });
      setSubmissionSuccess(true);
      setShowSubmitModal(false);
      
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("timerRunning");
      localStorage.removeItem("testStarted");
      localStorage.removeItem("showInstructions");
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("selectedOptions");
      localStorage.removeItem("testSubmitted");
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Failed to submit test. Please try again.");
    }
  };

  const handleChangeOption = (option) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestionIndex] = option;
    setSelectedOptions(updatedOptions);
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
    setTimerRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {submissionSuccess ? (
          <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">Your answers have been recorded. You may now close this window.</p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-4 sm:p-6">
            {!showInstructions && testStarted && testData.questions.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm font-medium text-gray-500">
                      Question <span className="text-gray-900">{currentQuestionIndex + 1}</span> of{" "}
                      {testData.questions.length}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        timeLeft < 300 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      ⏱️ {formatTime(timeLeft)} remaining
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {testData.questions[currentQuestionIndex].question}
                  </h2>

                  <div className="space-y-3">
                    {testData.questions[currentQuestionIndex].options.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleChangeOption(option)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedOptions[currentQuestionIndex] === option
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`flex items-center justify-center h-5 w-5 rounded-full border mr-3 ${
                              selectedOptions[currentQuestionIndex] === option
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedOptions[currentQuestionIndex] === option && (
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="text-gray-800">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      currentQuestionIndex === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedOptions[currentQuestionIndex] === undefined}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedOptions[currentQuestionIndex] === undefined
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {currentQuestionIndex === testData.questions.length - 1 ? "Submit Test" : "Next"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Skill Test Instructions</h2>
                    <p className="text-gray-600 mb-8">Please read all instructions carefully before starting</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <ul className="space-y-4">
                      {sampleInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg
                                className="h-3 w-3 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <span className="ml-3 text-gray-700">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-end">
                    <button
                      onClick={startTest}
                      className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Test
                      <svg
                        className="ml-2 -mr-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Submit your test?</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Are you sure you want to submit your test? You won't be able to make changes after submission.
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  onClick={handleSubmitTest}
                  className="w-full inline-flex justify-center rounded-md px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  onClick={handleCancelSubmit}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SkillTest;