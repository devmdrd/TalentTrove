import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/company/Header";
import Footer from "../../components/company/Footer";
import StepIndicator from "../../components/company/jobPostSteps/StepIndicator";
import JobDetails from "../../components/company/jobPostSteps/JobDetails";
import JobRequirements from "../../components/company/jobPostSteps/JobRequirements";
import SkillTest from "../../components/company/jobPostSteps/SkillTest";
import CompanyInfo from "../../components/company/jobPostSteps/CompanyInfo";
import api from "../../utils/axios";

const JobPost = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [includeSkillTest, setIncludeSkillTest] = useState(false);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    numberOfPosts: 1,
    description: "",
    skillsRequired: [],
    experienceRequired: "",
    salary: { min: 0, max: 0 },
    lastDateToApply: "",
    location: "",
    jobType: "Full-time",
  });

  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    website: "",
    address: "",
    state: "",
    country: "",
    description: "",
    industry: "",
    size: "",
    logo: "",
  });

  const [tempSkill, setTempSkill] = useState("");
  const [skillTestDetails, setSkillTestDetails] = useState({
    testName: "",
    timeLimit: 30,
    questions: [],
  });

  useEffect(() => {
    const getCompanyDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/company/profile");
        setCompanyDetails(data);
      } catch (error) {
        toast.error("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };

    if (step === 4) {
      getCompanyDetails();
    }
  }, [step]);

  const handleJobDetailsChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    const key = name.split(".")[1];
    setJobDetails((prev) => ({
      ...prev,
      salary: { ...prev.salary, [key]: Number(value) || 0 },
    }));
  };

  const addSkill = () => {
    const skill = tempSkill.trim();
    if (skill && !jobDetails.skillsRequired.includes(skill)) {
      setJobDetails((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill],
      }));
      setTempSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setJobDetails((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const jobData = {
        ...jobDetails,
        skillTest: includeSkillTest ? skillTestDetails : null,
      };
      const { data } = await api.post("/company/job", jobData);
  
      if (data.success) {
        toast.success(data.message || "Job posted successfully!");
      } else {
        toast.error(data.error || "Failed to post job. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  const getNextStep = () => {
    if (step === 2 && !includeSkillTest) {
      return 4; 
    }
    return step + 1;
  };
  
  const stepLabels = ["Job Details", "Skills & Requirements", "Skill Test (Optional)", "Company Info"];

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto my-10 px-6 py-8 bg-white rounded-lg shadow-lg">
        <StepIndicator 
          currentStep={step} 
          stepLabels={stepLabels} 
          skipStep={3}
          skipCondition={!includeSkillTest}
        />
        <form onSubmit={handleSubmit} className="mt-8">
          {step === 1 && (
            <JobDetails
              jobDetails={jobDetails}
              handleJobDetailsChange={handleJobDetailsChange}
              handleSalaryChange={handleSalaryChange}
              nextStep={() => setStep(getNextStep())}
            />
          )}
          {step === 2 && (
            <JobRequirements
              jobDetails={jobDetails}
              tempSkill={tempSkill}
              setTempSkill={setTempSkill}
              addSkill={addSkill}
              removeSkill={removeSkill}
              handleJobDetailsChange={handleJobDetailsChange}
              includeSkillTest={includeSkillTest}
              setIncludeSkillTest={setIncludeSkillTest}
              nextStep={() => setStep(getNextStep())}
              prevStep={() => setStep(step - 1)}
            />
          )}
          {step === 3 && includeSkillTest && (
            <SkillTest
              skillTestDetails={skillTestDetails}
              setSkillTestDetails={setSkillTestDetails}
              nextStep={() => setStep(getNextStep())}
              prevStep={() => setStep(step - 1)}
            />
          )}
          {step === 4 && (
            <CompanyInfo
              companyDetails={companyDetails}
              loading={loading}
              prevStep={() => setStep(includeSkillTest ? 3 : 2)}
              handleSubmit={handleSubmit}
            />
          )}
        </form>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default JobPost;
