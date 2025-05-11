import React, { useEffect, useState } from 'react';

const SkillTestResultModal = ({ job, onClose }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (job) {
      setIsVisible(true);
      if (job.skillTestScore > 0) {
        let start = 0;
        const end = job.skillTestScore;
        const duration = 1500;
        const incrementTime = 30;
        const timer = setInterval(() => {
          start += 1;
          setDisplayScore(start);
          if (start >= end) {
            setDisplayScore(end);
            clearInterval(timer);
          }
        }, incrementTime);
        return () => clearInterval(timer);
      }
    }
  }, [job]);

  if (!job || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <style jsx>{`
        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 0.7; }
          70%, 100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
      
      <div className={`bg-white rounded-xl shadow-lg p-6 w-full max-w-md transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Skill Test Result - {job.title}</h2>
        
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2 animate-pulse">Your Score:</p>
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-green-100 rounded-full opacity-0 animate-ping-slow"></div>
            <p className="relative text-5xl font-bold text-green-600">
              {displayScore}
              <span className="text-sm absolute top-0">%</span>
            </p>
          </div>
          
          <div className="mt-4 animate-fade-in">
            {job.skillTestScore >= 80 ? (
              <p className="text-green-500 font-medium">🎉 Excellent! This Candidate is great match!</p>
            ) : job.skillTestScore >= 50 ? (
              <p className="text-yellow-500 font-medium">👍 Good job! Candidate meet the requirements.</p>
            ) : (
              <p className="text-red-500 font-medium">💪 Candidate needs to Keep practicing!</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-right">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillTestResultModal;