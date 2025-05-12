import React, { useState, useCallback } from "react";
import api, { STATIC_URL } from "../../../utils/axios";
import { FiUpload, FiX, FiFile, FiCheckCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResumeSection = ({ resume, onUpdate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(["dragenter", "dragover"].includes(e.type));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    e.dataTransfer.files[0] && handleFileUpload(e.dataTransfer.files[0]);
  }, []);

  const handleFileChange = (e) => e.target.files[0] && handleFileUpload(e.target.files[0]);

  const handleFileUpload = async (file) => {
    if (!validTypes.includes(file.type)) return toast.error("Only PDF, DOC, or DOCX files allowed.");
    if (file.size > 5 * 1024 * 1024) return toast.error("File must be under 5MB.");
    setIsUploading(true); setUploadProgress(0);

    const formData = new FormData();
    formData.append("resumeOrCv", file);
    formData.append("section", "resumeOrCv");

    try {
      const { data } = await api.patch("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
      });
      toast.success("Resume uploaded successfully");
      onUpdate(data.candidateProfile.resumeOrCv);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteResume = async () => {
    try {
      await api.delete("/profile/resumeOrCv/item/resume");
      toast.success("Resume deleted successfully");
      onUpdate(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    const color = ext === "pdf" ? "text-red-500" : ["doc", "docx"].includes(ext) ? "text-blue-500" : "text-gray-500";
    return <FiFile className={color} />;
  };

  return (
    <div className="space-y-4">
      <ToastContainer />
      <h3 className="text-lg font-semibold">Your Resume</h3>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-3">
          <FiUpload className="h-10 w-10 text-gray-400" />
          <div className="text-sm text-gray-600">
            {dragActive ? <p>Drop your resume here</p> : <>
              <p className="font-medium">Drag and drop your resume here</p>
              <p className="text-xs">or</p>
            </>}
          </div>
          <label className="cursor-pointer">
            <span className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Browse Files</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" disabled={isUploading} />
          </label>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
        </div>
      )}

      {resume && !isUploading && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(resume)}
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{resume.split("/").pop()}</p>
                <a href={`${STATIC_URL}/public/${resume}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                  View Resume
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="mr-1" /> Uploaded
              </span>
              <button onClick={handleDeleteResume} className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100">
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSection;
