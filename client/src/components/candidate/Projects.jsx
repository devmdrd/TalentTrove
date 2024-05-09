import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import {
  getProjects,
  addProjects,
  editProjects,
  deleteProjects,
} from "../../services/candidateServices";

const Projects = ({ onProjectsChange }) => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    link: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [flag, setFlag] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjects();
        setProjects(response.projects);
        onProjectsChange(response.projects.length > 0);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, [onProjectsChange]);

  const handleAddProject = async () => {
    try {
      setShowModal(false);
      const response = await addProjects(newProject);
      setProjects(response.projects);
      setNewProject({ name: "", description: "", link: "" });
      setIsEditing(false);
      onProjectsChange(true);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEditProject = async () => {
    try {
      setShowModal(false);
      const response = await editProjects(editId, newProject);
      setProjects(response.projects);
      setFlag(!flag);
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  const handleRemoveProject = async (id) => {
    try {
      const response = await deleteProjects(id);
      setProjects(response.projects);
      onProjectsChange(response.projects.length > 0);
    } catch (error) {
      console.error("Error removing project:", error);
    }
  };

  const handleSaveProject = () => {
    if (isEditing && flag) {
      handleEditProject();
      setIsEditing(false);
    } else {
      handleAddProject();
    }
    setNewProject({ name: "", description: "", link: "" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewProject({ name: "", description: "", link: "" });
    setShowModal(false);
  };

  const handleEdit = (id, project) => {
    setIsEditing(true);
    setEditId(id);
    setNewProject(project);
    setFlag(true);
    setShowModal(true);
  };

  return (
    <div className="md:w-full bg-gray-50 px-6 py-4">
      <div className="flex justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Projects</h4>
        {!isEditing && (
          <span
            className="text-gray-500 cursor-pointer flex items-center"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="mr-1" /> Add Projects
          </span>
        )}
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Project" : "Add Project"}
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Project Name"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Description"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full resize-none"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Link"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newProject.link}
                onChange={(e) =>
                  setNewProject({ ...newProject, link: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md mr-2"
                onClick={handleSaveProject}
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
      {projects?.map((project) => (
        <div
          key={project._id}
          className="flex justify-between items-center mt-2"
        >
          <div>
            <p className="font-semibold">{project.name}</p>
            <p className="text-gray-500">{project.description}</p>
            <p className="text-blue-500">{project.link}</p>
          </div>
          {!isEditing && (
            <div>
              <button
                className="text-blue-500 mr-2"
                onClick={() => handleEdit(project._id, project)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500"
                onClick={() => handleRemoveProject(project._id)}
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

export default Projects;
