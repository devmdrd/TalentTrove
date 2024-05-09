import React, { useState, useEffect } from "react";
import { getPostedJobs, createSkillTest } from "../../services/recruiterServices";
import { useNavigate } from "react-router-dom";

const SkillTestForm = () => {
  const [formData, setFormData] = useState({
    testName: "",
    timeLimit: "",
    questions: [],
    jobId:""
  });
  const navigate = useNavigate();

  const [jobPosts, setJobPosts] = useState([]);
  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await getPostedJobs();
        setJobPosts(response.postedJobs);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      }
    };
  
    fetchJobPosts();
  
  }, []); 

  const handleJobChange = (e) => {
    setFormData({ ...formData, jobId: e.target.value });
  };

  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);

  const handleAddQuestionClick = () => {
    setShowAddQuestionForm(true);
  };

  const handleCancelQuestion = () => {
    setShowAddQuestionForm(false);
  };

  const handleAddQuestion = (newQuestion) => {
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
    setShowAddQuestionForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createSkillTest(formData);
      if (response.success) {
        alert(response.message);
        setFormData({
          testName: '',
          timeLimit: '',
          questions: [],
        });
        navigate("/recruiter/created-tests")
      } else {
        alert('Failed to create skill test');
      }
    } catch (error) {
      console.error('Error creating skill test:', error);
      alert('An error occurred while creating the skill test');
    }
  };

  return (
    <div className="flex mx-auto max-w-2xl my-10">
      {/* Left Section */}
      <div className="w-1/2 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Create Test</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Select Job Post:</label>
            <select
              value={formData.jobId}
              onChange={handleJobChange}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            >
              <option value="">Select Job Post</option>
              {jobPosts?.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Test Name:</label>
            <input
              type="text"
              name="testName"
              value={formData.testName}
              onChange={(e) =>
                setFormData({ ...formData, testName: e.target.value })
              }
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Time Limit (minutes):</label>
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={(e) =>
                setFormData({ ...formData, timeLimit: e.target.value })
              }
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>

          <h3 className="text-lg mb-2">Questions:</h3>
          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-4">
              <p className="font-semibold">
                Question {questionIndex + 1}: {question.question}
              </p>
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    {optionIndex + 1}. {option}
                  </li>
                ))}
              </ul>
              <p className="font-semibold">
                Correct Answer: {question.options[question.correctAnswer]}
              </p>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestionClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Add Question
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Create Test
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-6 bg-gray-100 rounded-lg shadow-lg">
        {showAddQuestionForm && (
          <AddQuestionForm onCancel={handleCancelQuestion} onAdd={handleAddQuestion} />
        )}
      </div>
    </div>
  );
};

const AddQuestionForm = ({ onCancel, onAdd }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleAddQuestion = () => {
    const newQuestion = {
      question,
      options: [...options],
      correctAnswer: parseInt(correctAnswer),
    };
    onAdd(newQuestion);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  return (
    <div>
      <h3 className="text-lg">Add Question</h3>
      <div className="mb-2">
        <label className="block">Question:</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="block w-full px-4 py-2 border rounded-lg focus:outline-none"
          rows={3}
          required
        />
      </div>
      {/* Option inputs */}
      <div className="mb-2">
        {options.map((option, index) => (
          <div key={index} className="">
            <label className="block">{`Option ${index + 1}:`}</label>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
        ))}
      </div>
      <div className="mb-2">
        <label className="block">Correct Answer:</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="block w-full px-4 py-2 border rounded-lg focus:outline-none"
          required
        >
          <option value="">Select Correct Answer</option>
          {options.map((_, index) => (
            <option key={index} value={index}>
              Option {index + 1}
            </option>
          ))}
        </select>
      </div>
      {/* Modal buttons */}
      <div>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
        >
          Add Question
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SkillTestForm;
