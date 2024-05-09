import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import {
  getLanguages,
  addLanguages,
  editLanguages,
  removeLanguages,
} from "../../services/candidateServices";

const Languages = ({ onLanguagesChange }) => {
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [newProficiency, setNewProficiency] = useState("Fluent");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLanguages();
        setLanguages(response.languages);
        onLanguagesChange(response.languages.length > 0);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchData();
  }, [onLanguagesChange]);

  const handleAddLanguage = async () => {
    try {
      const response = await addLanguages(newLanguage, newProficiency);
      setLanguages(response.candidate.languages);
      onLanguagesChange(true);
    } catch (error) {
      console.error("Error adding language:", error);
    }
    setNewLanguage("");
    setNewProficiency("Fluent");
    setIsEditing(false);
  };
  const handleEditLanguage = async () => {
    try {
      const response = await editLanguages(
        editIndex,
        newLanguage,
        newProficiency
      );
      setLanguages(response.candidate.languages);
      setFlag(!flag);
    } catch (error) {
      console.error("Error editing language:", error);
    }
  };
  const handleRemoveLanguage = async (id) => {
    try {
      const response = await removeLanguages(id);
      setLanguages(response.candidate.languages);
      onLanguagesChange(response.candidate.languages.length > 0);
    } catch (error) {
      console.error("Error removing language:", error);
    }
  };
  const handleSaveLanguage = () => {
    if (isEditing && flag) {
      handleEditLanguage();
    } else {
      handleAddLanguage();
    }
    setNewLanguage("");
    setNewProficiency("Fluent");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNewLanguage("");
    setNewProficiency("Fluent");
  };

  const handleEdit = (index, language) => {
    setIsEditing(true);
    setEditIndex(index);
    setFlag(true);
    setNewLanguage(language.name);
    setNewProficiency(language.proficiency);
  };

  return (
    <div className="md:w-full bg-gray-50 px-6 py-4">
      <div className="flex justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Languages</h4>
        {!isEditing && (
          <span
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <FaPlus className="inline-block mr-1" /> Add Language
          </span>
        )}
      </div>
      {isEditing && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Language"
            className="border border-gray-300 rounded-md px-3 py-1 mr-2"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
          />
          <select
            value={newProficiency}
            onChange={(e) => setNewProficiency(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 mr-2"
          >
            <option value="Fluent">Fluent</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Beginner">Beginner</option>
          </select>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
            onClick={handleSaveLanguage}
          >
            Save
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded-md"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </div>
      )}
      {languages?.map((language) => (
        <div
          key={language._id}
          className="flex justify-between items-center mt-2"
        >
          <div>
            <p>{language.name}</p>
            <p className="text-sm text-gray-500">{language.proficiency}</p>
          </div>
          {!isEditing && (
            <div>
              <button
                className="text-red-500 mr-2"
                onClick={() => handleRemoveLanguage(language._id)}
              >
                <FaTrash />
              </button>
              <button
                className="text-blue-500"
                onClick={() => handleEdit(language._id, language)}
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Languages;
