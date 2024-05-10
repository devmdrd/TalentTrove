import React, { useState, useEffect } from "react";
import {
  getTitle,
  saveTitle,
  getAboutText,
  saveAboutText,
  getImage,
  saveImage,
} from "../../services/candidateServices";
import {
  FaEdit,
  FaRegImage,
  FaSave,
  FaTimes,
  FaPlusCircle,
} from "react-icons/fa";
import Header from "../../components/candidate/Header";
import Resume from "../../components/candidate/Resume";
import Skills from "../../components/candidate/Skills";
import Experience from "../../components/candidate/Experience";
import Projects from "../../components/candidate/Projects";
import Education from "../../components/candidate/Education";
import Certifications from "../../components/candidate/Certifications";
import Languages from "../../components/candidate/Languages";
import Footer from "../../components/candidate/Footer";

const Profile = () => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [title, setTitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(true);
  const [updatedProfilePic, setupdatedProfilePic] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await getTitle();
        setTitle(response.title);
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };
    fetchTitle();
  }, []);

  useEffect(() => {
    const fetchAboutText = async () => {
      try {
        const response = await getAboutText();
        setAboutText(response.aboutText);
      } catch (error) {
        console.error("Error fetching about text:", error);
      }
    };
    fetchAboutText();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getImage();
        setupdatedProfilePic(response.profilePicture);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchImage();
  }, []);

  const [hasResume, setHasResume] = useState(false);
  const [hasExperience, setHasExperience] = useState(false);
  const [hasEducation, setHasEducation] = useState(false);
  const [hasCertifications, setHasCertifications] = useState(false);
  const [hasLanguages, setHasLanguages] = useState(false);
  const [hasProjects, setHasProjects] = useState(false);
  const [hasSkills, setHasSkills] = useState(false);

  useEffect(() => {
    // Calculate profile completion
    const calculateProfileCompletion = () => {
      let completion = 0;
      // Check if title is filled
      if (title?.trim() !== "") completion += 10;
      // Check if about text is filled
      if (aboutText?.trim() !== "") completion += 10;
      // Check if profile picture is uploaded
      if (updatedProfilePic !== "") completion += 10;
      // Check if experience data exists
      if (hasExperience) completion += 10;
      // Check if education data exists
      if (hasEducation) completion += 10;
      // Check if certifications data exists
      if (hasCertifications) completion += 10;
      // Check if languages data exists
      if (hasLanguages) completion += 10;
      // Check if projects data exists
      if (hasProjects) completion += 10;
      // Check if skills data exists
      if (hasSkills) completion += 10;
      // Check if resume is uploaded
      if (hasResume) completion += 10;
      // Round to two decimal places
      setProfileCompletion(completion.toFixed(2));
    };

    calculateProfileCompletion();
  }, [
    title,
    aboutText,
    updatedProfilePic,
    hasResume,
    hasExperience,
    hasEducation,
    hasCertifications,
    hasLanguages,
    hasProjects,
  ]);

  const handleEditTitle = () => setIsEditingTitle(!isEditingTitle);

  const handleEditAbout = () => setIsEditingAbout(!isEditingAbout);

  const handleSaveTitle = async () => {
    try {
      setIsEditingTitle(false);
      const response = await saveTitle(title);
      setTitle(response.title);
    } catch (error) {
      console.error("Error saving title:", error);
    }
  };

  const handleSaveAbout = async () => {
    setIsEditingAbout(false);
    try {
      const response = await saveAboutText(aboutText);
      setAboutText(response.about);
    } catch (error) {
      console.error("Error saving about text:", error);
    }
  };

  const handleSaveImage = async () => {
    setShow(!show);
    try {
      const response = await saveImage(image);
      setupdatedProfilePic(response.profilePicture);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <>
      <Header />
      <div className="w-3/4 mx-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-full overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 px-6 py-4 border-r border-gray-200">
                <Resume onResumeChange={(value) => setHasResume(value)} />
                <div className="text-center relative">
                  <label htmlFor="profile-image" className="cursor-pointer">
                    {!updatedProfilePic ? (
                      <img
                        className="h-20 w-20 rounded-full mx-auto"
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : "https://via.placeholder.com/150"
                        }
                        alt="Profile Picture"
                      />
                    ) : (
                      <img
                        className="h-20 w-20 rounded-full mx-auto"
                        src={`https://talenttrove-9jlw.onrender.com/${updatedProfilePic}`}
                        alt="Profile Picture"
                      />
                    )}
                    {show && (
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    )}
                    {image ? (
                      <div className="absolute top-0 right-0">
                        <button
                          onClick={handleSaveImage}
                          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                        >
                          {show ? <FaSave /> : <FaRegImage />}
                        </button>
                      </div>
                    ) : (
                      <FaRegImage className="absolute top-0 right-0 text-gray-500" />
                    )}
                  </label>
                  <div className="flex items-center">
                    <h3 className="mt-4 text-xl font-semibold text-gray-800 flex-grow">
                      {isEditingTitle ? (
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="border-b border-gray-300 rounded-b-none px-3 py-1 mt-1 outline-none"
                          style={{
                            borderTopWidth: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            height: "1.5rem",
                            verticalAlign: "top",
                          }}
                        />
                      ) : (
                        title
                      )}
                    </h3>
                    <div className="flex items-center">
                      {isEditingTitle ? (
                        <button
                          onClick={handleSaveTitle}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaSave />
                        </button>
                      ) : (
                        <button
                          onClick={handleEditTitle}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-lg font-semibold mb-2"></p>
                  <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full text-center text-white text-xs leading-none py-1"
                      style={{ width: `${profileCompletion}%` }}
                    >
                      {profileCompletion}%
                    </div>
                  </div>
                </div>
                <div className="md:w-full bg-gray-50 px-6 py-4 mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-700">
                      About Me
                    </h4>
                    <div className="flex items-center">
                      {!isEditingAbout && (
                        <button
                          onClick={handleEditAbout}
                          className="text-gray-500 hover:text-gray-700 flex items-center"
                        >
                          <FaPlusCircle className="mr-2" />
                          Add Bio
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    {!isEditingAbout && aboutText && (
                      <p className="mt-4">{aboutText}</p>
                    )}
                    {isEditingAbout && (
                      <div>
                        <textarea
                          className="border border-gray-300 rounded-md px-3 py-2 w-full"
                          value={aboutText}
                          onChange={(e) => setAboutText(e.target.value)}
                          placeholder="Enter a short description of yourself"
                        ></textarea>
                        <div className="mt-2">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
                            onClick={handleSaveAbout}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="bg-gray-300 px-3 py-1 rounded-md"
                            onClick={() => {
                              setIsEditingAbout(false);
                              setAboutText(""); // Reset the about text if cancelled
                            }}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6 mt-6">
                  <Skills onSkillsChange={(value) => setHasSkills(value)} />
                </div>
              </div>
              <div className="md:w-1/2 px-6 py-4">
                <div className="md:flex flex-col md:h-full">
                  <div className="mb-6">
                    <Experience
                      onExperienceChange={(value) => setHasExperience(value)}
                    />
                  </div>
                  <div className="mb-6">
                    <Projects
                      onProjectsChange={(value) => setHasProjects(value)}
                    />
                  </div>
                  <div className="mb-6">
                    <Education
                      onEducationChange={(value) => setHasEducation(value)}
                    />
                  </div>
                  <div className="mb-6">
                    <Certifications
                      onCertificationsChange={(value) =>
                        setHasCertifications(value)
                      }
                    />
                  </div>
                  <div className="mb-6">
                    <Languages
                      onLanguagesChange={(value) => setHasLanguages(value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
