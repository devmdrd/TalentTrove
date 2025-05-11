import React, { useState } from "react";
import { FaChevronLeft,  FaChevronRight,  FaPlus,  FaTimes, FaClock, FaEdit } from "react-icons/fa";

const SkillTest = ({ skillTestDetails, setSkillTestDetails, nextStep, prevStep }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [error, setError] = useState("");

  const validateQuestion = () => {
    if (!newQuestion.question.trim()) {
      setError("Question is required");
      return false;
    }
    if (newQuestion.options.some((opt) => !opt.trim())) {
      setError("All options must be filled");
      return false;
    }
    const uniqueOptions = new Set(newQuestion.options.map((opt) => opt.trim()));
    if (uniqueOptions.size !== newQuestion.options.length) {
      setError("All options must be unique");
      return false;
    }
    return true;
  };

  const addQuestion = () => {
    if (!validateQuestion()) return;
    setSkillTestDetails((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion }],
    }));
    setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
    setError("");
    setIsModalOpen(false);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newQuestion.options];
    updated[index] = value;
    setNewQuestion((prev) => ({ ...prev, options: updated }));
  };

  const removeQuestion = (index) => {
    setSkillTestDetails((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const isFormComplete = skillTestDetails.testName.trim() && skillTestDetails.timeLimit > 0 && skillTestDetails.questions.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Skill Test</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaEdit className="mr-2" />
            Test Name
          </label>
          <input
            type="text"
            value={skillTestDetails.testName}
            onChange={(e) => setSkillTestDetails({ ...skillTestDetails, testName: e.target.value })}
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg"
            placeholder="Enter test name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <FaClock className="mr-2" />
            Time Limit (minutes)
          </label>
          <input
            type="number"
            value={skillTestDetails.timeLimit}
            onChange={(e) =>
              setSkillTestDetails({
                ...skillTestDetails,
                timeLimit: Math.max(1, Number(e.target.value)),
              })
            }
            min="1"
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg"
            placeholder="Time limit in minutes"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-600">Questions</h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <FaPlus className="mr-1" size={12} />
            Add Question
          </button>
        </div>

        {skillTestDetails.questions.length > 0 ? (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg max-h-60 overflow-auto">
            {skillTestDetails.questions.map((q, i) => (
              <div key={i} className="flex justify-between items-start p-3 bg-white rounded-lg shadow-sm">
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{q.question}</p>
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`text-sm ${idx === q.correctAnswer ? "text-green-600 font-medium" : "text-gray-600"}`}
                      >
                        {opt} {idx === q.correctAnswer && "✓"}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No questions added yet</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center px-5 py-2 text-gray-700 font-medium rounded-lg hover:text-blue-600"
        >
          <FaChevronLeft className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!isFormComplete}
          className={`flex items-center px-6 py-2 font-medium rounded-lg transition-colors 
            ${isFormComplete ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          Next: Company Info
          <FaChevronRight className="ml-2" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Question</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1">Question</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => {
                    setNewQuestion({ ...newQuestion, question: e.target.value });
                    if (e.target.value.trim()) setError("");
                  }}
                  rows={3}
                  className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Options</label>
                {newQuestion.options.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newQuestion.correctAnswer === i}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: i })}
                      className="text-blue-600"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      className="flex-1 px-3 py-1 text-gray-800 border border-gray-200 rounded"
                      placeholder={`Option ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTest;
