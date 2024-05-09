import React, { useState } from "react";

const FAQ = () => {
  const [answersVisibility, setAnswersVisibility] = useState({
    answer1: false,
    answer2: false,
    answer3: false,
    answer4: false,
  });

  const toggleAnswer = (id) => {
    setAnswersVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Explore Common Questions for Job Seekers
          </h2>
        </div>
        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {[
            {
              question: "How do I create a compelling resume?",
              answer:
                "Creating a compelling resume involves highlighting your relevant skills, experiences, and achievements. Ensure it's tailored to each job application and is error-free.",
            },
            {
              question: "What should I include in a cover letter?",
              answer:
                "A cover letter should introduce yourself, explain why you're interested in the position, and highlight how your skills and experiences make you a good fit for the role.",
            },
            {
              question: "How do I prepare for a job interview?",
              answer:
                "To prepare for a job interview, research the company, practice common interview questions, and be ready to discuss your experiences and skills. Also, dress appropriately and arrive on time.",
            },
            {
              question: "How can I improve my job search?",
              answer:
                "To improve your job search, utilize job search engines, networking platforms, and professional connections. Tailor your applications to each job, and consider seeking advice from career counselors or mentors.",
            },
          ].map((item, index) => (
            <div
              key={`question${index}`}
              className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50"
            >
              <button
                type="button"
                id={`question${index}`}
                data-state="closed"
                onClick={() => toggleAnswer(`answer${index}`)}
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
              >
                <span className="flex text-lg font-semibold text-black">
                  {item.question}
                </span>
                <svg
                  id={`arrow${index}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 text-gray-400 transform ${
                    answersVisibility[`answer${index}`]
                      ? "rotate-0"
                      : "rotate-180"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id={`answer${index}`}
                style={{
                  display: answersVisibility[`answer${index}`]
                    ? "block"
                    : "none",
                }}
                className="px-4 pb-5 sm:px-6 sm:pb-6"
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
