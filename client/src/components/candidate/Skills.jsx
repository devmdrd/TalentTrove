import React, { useState, useEffect } from "react";
import {
  getSkills,
  addSkills,
  removeSkills,
} from "../../services/candidateServices";
import { FaPlus, FaTimes } from "react-icons/fa";

const Skills = ({ onSkillsChange }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSkills();
        setSkills(response.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddSkill = async () => {
    try {
      setIsEditing(false);
      const response = await addSkills(newSkill);
      setSkills(response.skills);
      setNewSkill("");
      onSkillsChange(true); // Notify parent component about skill change
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleRemoveSkill = async (index) => {
    try {
      const response = await removeSkills(index);
      setSkills(response.candidate.skills);
      onSkillsChange(true); // Notify parent component about skill change
    } catch (error) {
      console.error("Error removing skill:", error);
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewSkill("");
  };

  useEffect(() => {
    // Notify parent component when skills change
    onSkillsChange(skills.length > 0);
  }, [skills, onSkillsChange]);

  return (
    <div className="md:w-full bg-gray-50 px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Skills</h4>
        {!isEditing && (
          <span
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <FaPlus className="inline-block mr-1" /> Add Skills
          </span>
        )}
      </div>
      {isEditing && (
        <div className="flex items-center mt-2">
          <input
            type="text"
            placeholder="Skill"
            className="border border-gray-300 rounded-md px-3 py-1 mr-2"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
            onClick={handleAddSkill}
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
      <div className="flex flex-wrap mt-2">
        {skills.map((skill, index) => (
          <div key={index} className="relative">
            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm mr-2 mb-2 flex items-center">
              {skill}
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleRemoveSkill(index)}
              >
                <FaTimes />
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
