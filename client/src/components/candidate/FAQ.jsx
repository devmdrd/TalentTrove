import React, { useState } from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create a compelling resume?",
      answer:
        "Focus on quantifiable achievements, use action verbs, and tailor it to each job. Keep it concise (1-2 pages) and use a clean, professional format. Highlight skills relevant to the position.",
    },
    {
      question: "What should I include in a cover letter?",
      answer:
        "Your cover letter should include: 1) A strong opening paragraph, 2) Why you're interested in this specific role, 3) How your skills match the job requirements, and 4) A call to action for next steps.",
    },
    {
      question: "How do I prepare for a job interview?",
      answer:
        "Research the company thoroughly, practice common behavioral questions using the STAR method, prepare questions to ask the interviewer, and do mock interviews. Dress professionally and test your tech setup if it's a virtual interview.",
    },
    {
      question: "How can I improve my job search?",
      answer:
        "Optimize your LinkedIn profile, network actively, set up job alerts, customize applications for each role, follow up after applying, and consider working with a career coach. Quality applications beat quantity.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about finding your next career opportunity.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-12 space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="transition-all duration-200 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:border-blue-200"
            >
              <button
                type="button"
                onClick={() => toggleAnswer(index)}
                className="flex items-center justify-between w-full px-6 py-5 sm:p-6 text-left"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`px-6 pb-6 ${activeIndex === index ? "block" : "hidden"}`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;