import React, { useState } from "react";
import { FaEdit, FaRegImage, FaSave, FaUser, FaTimes } from "react-icons/fa";
import { STATIC_URL } from "../../../utils/axios";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ProfileCard = ({
  profileData,
  profileCompletion,
  updateBasicInfo,
  updateProfilePicture,
}) => {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [name, setName] = useState(profileData.name);
  const [about, setAbout] = useState(profileData.about);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveImage = async () => {
    if (image) {
      await updateProfilePicture(image);
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSaveName = async () => {
    if (await updateBasicInfo("name", name)) {
      setIsNameModalOpen(false);
    }
  };

  const handleSaveAbout = async () => {
    if (await updateBasicInfo("about", about)) {
      setIsAboutModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-3">
          <img
            className="h-32 w-32 rounded-full object-cover border border-gray-300"
            src={
              imagePreview ||
              (profileData.profilePicture
                ? `${STATIC_URL}/public/${profileData.profilePicture}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileData.name || "User"
                  )}&background=random&size=150`)
            }
            alt="Profile"
          />
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer border border-gray-200 hover:bg-gray-100"
          >
            <FaRegImage className="text-gray-600 text-sm" />
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {image && (
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleSaveImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <FaSave className="mr-1" /> Save Photo
            </button>
            <button
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm flex items-center"
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <h1 className="text-lg font-semibold text-gray-800">
            {name || "Your Name"}
          </h1>
          <button
            onClick={() => setIsNameModalOpen(true)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FaEdit />
          </button>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
          <div
            className="bg-blue-500 h-full rounded-full"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <div className="text-xs text-gray-500">
          Profile {profileCompletion}% complete
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-medium text-gray-700">About</h3>
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FaEdit />
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          {about || "No information provided"}
        </p>
      </div>

      <Modal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        title="Edit Name"
      >
        <div className="p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setIsNameModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveName}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        title="Edit About"
      >
        <div className="p-4">
          <textarea
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="5"
            placeholder="Tell us about yourself..."
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAbout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileCard;