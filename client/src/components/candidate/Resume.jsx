import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";
import { resumeUpload } from "../../services/candidateServices";
import { getResume } from "../../services/candidateServices";

const Resume = ({ onResumeChange }) => {
  const [resume, setResume] = useState(null);
  const [updatedResume, setUpdatedResume] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      try {
        const formData = new FormData();
        formData.append("resume", file);
        const response = await resumeUpload(formData);
        if (response.success) {
          setUpdatedResume(true);
          onResumeChange(true); // Notify parent component about resume change
          alert("Resume uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading resume:", error);
        alert("Failed to upload resume");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getResume();
        if (response.resume) {
          setResume(response.resume);
          setUpdatedResume(true);
          onResumeChange(true); // Notify parent component about existing resume
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="mb-6 bg-slate-200 p-4 rounded-lg">
      {resume ? (
        <div className="flex items-center">
          <a
            href={
              updatedResume
                ? `http://localhost:3001/${resume}`
                : URL.createObjectURL(resume)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 mr-4"
          >
            Preview
          </a>
        </div>
      ) : (
        <div>
          <label
            htmlFor="resume-upload"
            className="flex items-center cursor-pointer"
          >
            <FaUpload className="mr-1" /> Upload Resume
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default Resume;
