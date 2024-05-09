import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import {
  getCertifications,
  addCertifications,
  editCertifications,
  deleteCertifications,
} from "../../services/candidateServices";

const Certifications = ({ onCertificationsChange }) => {
  const [certifications, setCertifications] = useState([]);
  const [newCertification, setNewCertification] = useState({
    name: "",
    organization: "",
    year: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [flag, setFlag] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCertifications();
        setCertifications(response.certifications);
        onCertificationsChange(response.certifications.length > 0);
      } catch (error) {
        console.error("Error fetching Certifications:", error);
      }
    };

    fetchData();
  }, [onCertificationsChange]);

  const handleAddCertification = async () => {
    try {
      setShowModal(false);
      const response = await addCertifications(newCertification);
      setCertifications(response.certifications);
      setNewCertification({ name: "", organization: "", year: "" });
      setIsEditing(false);
      onCertificationsChange(true);
    } catch (error) {
      console.error("Error adding Certification:", error);
    }
  };

  const handleEditCertification = async () => {
    try {
      setShowModal(false);
      const response = await editCertifications(editId, newCertification);
      setCertifications(response.certifications);
      setFlag(!flag);
    } catch (error) {
      console.error("Error editing Certification:", error);
    }
  };

  const handleRemoveCertification = async (id) => {
    try {
      const response = await deleteCertifications(id);
      setCertifications(response.certifications);
      onCertificationsChange(response.certifications.length > 0);
    } catch (error) {
      console.error("Error removing certification:", error);
    }
  };

  const handleSaveCertification = () => {
    if (isEditing && flag) {
      handleEditCertification();
      setIsEditing(false);
    } else {
      handleAddCertification();
    }
    setNewCertification({ name: "", organization: "", year: "" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewCertification({ name: "", organization: "", year: "" });
    setShowModal(false);
  };

  const handleEdit = (id, certification) => {
    setIsEditing(true);
    setEditId(id);
    setNewCertification(certification);
    setFlag(true);
    setShowModal(true);
  };

  return (
    <div className="md:w-full bg-gray-50 px-6 py-4">
      <div className="flex justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Certifications</h4>
        {!isEditing && (
          <span
            className="text-gray-500 cursor-pointer flex items-center"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="mr-1" /> Add Certifications
          </span>
        )}
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Certification" : "Add Certification"}
            </h2>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Certification Name"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newCertification.name}
                onChange={(e) =>
                  setNewCertification({ ...newCertification, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="organization"
                placeholder="Issuing Organization"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newCertification.organization}
                onChange={(e) =>
                  setNewCertification({ ...newCertification, organization: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="year"
                placeholder="Year"
                className="border border-gray-300 rounded-md px-3 py-1 mb-2 w-full"
                value={newCertification.year}
                onChange={(e) =>
                  setNewCertification({ ...newCertification, year: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md mr-2"
                onClick={handleSaveCertification}
              >
                {isEditing ? "Save" : "Add"}
              </button>
              <button
                className="bg-gray-300 px-6 py-2 rounded-md"
                onClick={() => handleCancelEdit()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {certifications?.map((certification) => (
        <div
          key={certification._id}
          className="flex justify-between items-center mt-2"
        >
          <div>
            <p className="font-semibold">{certification.name}</p>
            <p className="text-gray-500">{certification.organization}</p>
            <p className="text-blue-500">{certification.year}</p>
          </div>
          {!isEditing && (
            <div>
              <button
                className="text-blue-500 mr-2"
                onClick={() => handleEdit(certification._id, certification)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500"
                onClick={() => handleRemoveCertification(certification._id)}
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

export default Certifications;
