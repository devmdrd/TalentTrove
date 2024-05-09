import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import {
  getEducations,
  addEducations,
  editEducations,
  deleteEducations,
} from "../../services/candidateServices";

const Education = ({ onEducationChange }) => {
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [flag, setFlag] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEducations();
        setEducation(response.educations);
        onEducationChange(response.educations.length > 0);
      } catch (error) {
        console.error("Error fetching Educations:", error);
      }
    };

    fetchData();
  }, [onEducationChange]);

  const handleAddEducation = async () => {
    try {
      setShowModal(false);
      const response = await addEducations(newEducation);
      setEducation(response.educations);
      setNewEducation({ degree: "", institution: "", year: "" });
      setIsEditing(false);
      onEducationChange(true);
    } catch (error) {
      console.error("Error adding Education:", error);
    }
  };

  const handleEditEducation = async () => {
    try {
      setShowModal(false);
      const response = await editEducations(editId, newEducation);
      setEducation(response.educations);
      setFlag(!flag);
    } catch (error) {
      console.error("Error editing Education:", error);
    }
  };

  const handleRemoveEducation = async (id) => {
    try {
      const response = await deleteEducations(id);
      setEducation(response.educations);
      onEducationChange(response.educations.length > 0);
    } catch (error) {
      console.error("Error removing education:", error);
    }
  };

  const handleSaveEducation = () => {
    if (isEditing && flag) {
      handleEditEducation();
      setIsEditing(false);
    } else {
      handleAddEducation();
    }
    setNewEducation({ degree: "", institution: "", year: "" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewEducation({ degree: "", institution: "", year: "" });
    setShowModal(false);
  };

  const handleEdit = (id, edu) => {
    setIsEditing(true);
    setEditId(id);
    setNewEducation(edu);
    setFlag(true);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };

  return (
    <div className="md:w-full bg-gray-50 px-6 py-4">
      <div className="flex justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Education</h4>
        {!isEditing && (
          <span
            className="text-gray-500 cursor-pointer flex items-center"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="mr-1" /> Add Education
          </span>
        )}
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Education" : "Add Education"}
            </h2>
            <div className="mb-4">
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newEducation.degree}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newEducation.institution}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="year"
                placeholder="Year"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newEducation.year}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md mr-2"
                onClick={handleSaveEducation}
              >
                {isEditing ? "Save" : "Add"}
              </button>
              <button
                className="bg-gray-300 px-6 py-2 rounded-md"
                onClick={() => {
                  handleCancelEdit();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {education?.map((edu) => (
        <div key={edu._id} className="flex justify-between items-center mt-2">
          <div>
            <p className="font-semibold">{edu.degree}</p>
            <p className="text-gray-500">{edu.institution}</p>
            <p className="text-blue-500">{edu.year}</p>
          </div>
          {!isEditing && (
            <div>
              <button
                className="text-blue-500 mr-2"
                onClick={() => handleEdit(edu._id, edu)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500"
                onClick={() => handleRemoveEducation(edu._id)}
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Education;
