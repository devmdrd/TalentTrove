import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import {
  getExperiences,
  addExperiences,
  editExperiences,
  deleteExperiences,
} from "../../services/candidateServices";

const Experience = ({ onExperienceChange }) => {
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({
    title: "",
    companyName: "",
    yearsOfExperience: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [flag, setFlag] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExperiences();
        setExperience(response.experiences);
        onExperienceChange(response.experiences.length > 0);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    fetchData();
  }, [onExperienceChange]);

  const handleAddExperience = async () => {
    try {
      setShowModal(false); // Hide the modal after adding
      const response = await addExperiences(newExperience);
      setExperience(response.experiences);

      setNewExperience({
        title: "",
        companyName: "",
        yearsOfExperience: "",
        description: "",
      });
      onExperienceChange(true);
    } catch (error) {
      console.error("Error adding experience:", error);
    }
  };

  const handleEditExperience = async () => {
    try {
      setShowModal(false); // Hide the modal after adding
      const response = await editExperiences(editId, newExperience);
      setExperience(response.experiences);

      setFlag(!flag);
    } catch (error) {
      console.error("Error editing experience:", error);
    }
  };

  const handleRemoveExperience = async (id) => {
    try {
      const response = await deleteExperiences(id);
      setExperience(response.experiences);
      onExperienceChange(response.experiences.length > 0);
    } catch (error) {
      console.error("Error removing experience:", error);
    }
  };

  const handleSaveExperience = () => {
    if (isEditing && flag) {
      handleEditExperience();
      setIsEditing(false);
    } else {
      handleAddExperience();
    }
    setNewExperience({
      title: "",
      companyName: "",
      yearsOfExperience: "",
      description: "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewExperience({
      title: "",
      companyName: "",
      yearsOfExperience: "",
      description: "",
    });
  };

  const handleEdit = (id, exp) => {
    setIsEditing(true);
    setEditId(id);
    setNewExperience(exp);
    setFlag(true);
    setShowModal(true); // Show modal when editing
  };

  return (
    <div className="md:w-full bg-gray-50 px-6 py-4">
      <div className="flex justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Experience</h4>
        {!isEditing && (
          <span
            className="text-gray-500 cursor-pointer flex items-center"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="mr-1" /> Add Experience
          </span>
        )}
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Experience" : "Add Experience"}
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Title"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Company"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newExperience.companyName}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    companyName: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Years"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newExperience.yearsOfExperience}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    yearsOfExperience: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Description"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md mr-2"
                onClick={handleSaveExperience}
              >
                {isEditing ? "Save" : "Add"}
              </button>
              <button
                className="bg-gray-300 px-6 py-2 rounded-md"
                onClick={() => {
                  handleCancelEdit();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {experience?.map((exp) => (
        <div key={exp._id} className="flex justify-between items-center mt-2">
          <div>
            <p className="font-semibold">{exp.title}</p>
            <p className="text-gray-500">{exp.companyName}</p>
            <p className="text-gray-500">{exp.yearsOfExperience} years</p>
            <p>{exp.description}</p>
          </div>
          {!isEditing && (
            <div>
              <button
                className="text-blue-500 mr-2"
                onClick={() => handleEdit(exp._id, exp)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500"
                onClick={() => handleRemoveExperience(exp._id)}
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

export default Experience;
