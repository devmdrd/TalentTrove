import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getApplicantData,
  getSkillTests,
} from "../../services/recruiterServices";
import {
  assignTest,
  sendNotification,
} from "../../services/recruiterServices";

function CandidateDetails() {
  const { id, applicationId } = useParams();
  const [applicantDetails, setApplicantDetails] = useState(null);
  const [skillTests, setSkillTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [isTestGiven, setIsTestGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await getApplicantData(id);
        setApplicantDetails(response);
        // Check if there is a status with 'in-progress'
        const isInProgress = response.status.some(
          (statusObj) => statusObj.status === "in-progress"
        );

        setIsTestGiven(isInProgress);
      } catch (error) {
        console.error("Error fetching applicant details:", error);
      }
    };
    fetchApplicantDetails();
  }, [id]);

  useEffect(() => {
    const fetchSkillTests = async () => {
      try {
        const data = await getSkillTests();
        setSkillTests(data);
      } catch (error) {
        console.error("Error fetching skill tests:", error);
      }
    };
    fetchSkillTests();
  }, []);
  const handleSkillTest = async () => {
    setIsLoading(true);
    try {
      const response = await assignTest({
        applicationId,
        skillTestId: selectedTest,
      });
      setIsTestGiven(true);
      // setShowNotification(true);
      await sendNotification({
        recipient: applicantDetails.applicantDetails._id,
        message:
          "Skill test assigned! Please take the test as soon as possible.",
      });
    } catch (error) {
      console.error("Error initiating skill test:", error);
      alert("Error initiating skill test!");
    }
    setIsLoading(false);
  };

  const handleDownloadResume = () => {
    if (applicantDetails.applicantDetails.resumeOrCv) {
      window.open(
        `http://localhost:3001/${applicantDetails.applicantDetails.resumeOrCv}`,
        "_blank"
      );
    } else {
      alert("No resume uploaded");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {applicantDetails && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">
                  {applicantDetails.applicantDetails.name}
                </h1>
                <p className="text-gray-600">
                  {applicantDetails.applicantDetails.email}
                </p>
              </div>
              <div>
                <button
                  onClick={handleDownloadResume}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  Download Resume
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {applicantDetails.applicantDetails.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Experience</h2>
                {applicantDetails.experienceDetails.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-700 font-semibold">{exp.title}</p>
                    <p className="text-gray-600">{exp.companyName}</p>
                    <p className="text-gray-600">
                      {exp.yearsOfExperience} years
                    </p>
                    <p className="text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                {applicantDetails.educationDetails.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-700 font-semibold">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-gray-600">{edu.year}</p>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                {applicantDetails.certificationDetails.map((cert, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-700 font-semibold">{cert.name}</p>
                    <p className="text-gray-600">{cert.organization}</p>
                    <p className="text-gray-600">{cert.year}</p>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Languages</h2>
                {applicantDetails.applicantDetails.languages.map(
                  (language, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-gray-700 font-semibold">
                        {language.name}
                      </p>
                      <p className="text-gray-600">{language.proficiency}</p>
                    </div>
                  )
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                {applicantDetails.projectDetails.map((project, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-700 font-semibold">
                      {project.name}
                    </p>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Skill Test</h2>
              <div className="flex flex-col gap-4">
                <select
                  id="skillTest"
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                >
                  <option value="">Choose Test</option>
                  {skillTests.map((test) => (
                    <option key={test._id} value={test._id}>
                      {test.testName}
                    </option>
                  ))}
                </select>
                {isTestGiven ? (
                  <p className="text-green-500 font-semibold">
                    Skill Test Given
                  </p>
                ) : (
                  <button
                    onClick={handleSkillTest}
                    className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg ${
                      isLoading || !selectedTest
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isLoading || !selectedTest}
                  >
                    {isLoading ? "Loading..." : "Give Test"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateDetails;
