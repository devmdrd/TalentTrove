import React, { useEffect } from "react";
import Header from "../../components/candidate/Header";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FAQ from "../../components/candidate/FAQ";
import BrandsGrid from "../../components/candidate/BrandsGrid";
import Features from "../../components/candidate/Features";
import Footer from "../../components/candidate/Footer";
import bannerImage from "../../assets/banner.png";
import { loginSuccess } from "../../features/auth/authSlice";
import { FiSearch, FiBriefcase, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");

    if (googleToken) {
      dispatch(loginSuccess({ token: googleToken }));
      navigate("/", { replace: true }); 
    }
  }, [dispatch, navigate]);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
      
      <div className="relative min-h-screen">
        <Header />
        
        <section className="relative pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 lg:text-6xl leading-tight"
            >
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Job</span> <br />
              With Ease
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Thousands of jobs waiting for you. Get matched with top companies in minutes.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 max-w-2xl mx-auto"
            >
              <div className="relative flex items-center bg-white rounded-lg shadow-lg p-2 border border-gray-200">
                <FiSearch className="ml-4 text-gray-400 text-xl" />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className="w-full px-4 py-3 focus:outline-none text-gray-700"
                />
                <a href={!isAuthenticated ? "/signin" : "/jobs"} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
                  Search Jobs
                </a>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
          >
            {[
              { number: "10K+", label: "Jobs Available" },
              { number: "500+", label: "Companies Hiring" },
              { number: "95%", label: "Satisfaction Rate" },
              { number: "24h", label: "Fast Response" },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-indigo-600">{stat.number}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            {!isAuthenticated ? (
              <>
                <BrandsGrid />
                <FAQ />
              </>
            ) : (
              <Features />
            )}
          </div>
        </div>
        
        {isAuthenticated && (
          <section className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-20 px-6">
            <div className="max-w-4xl mx-auto text-center text-gray-800">
              <div className="bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-xl">
                <h2 className="text-4xl font-extrabold mb-6 leading-tight tracking-tight">
                  Ready to take the next step in your career?
                </h2>
                <p className="text-lg mb-10 text-gray-700">
                  Join thousands of professionals who found their dream jobs through us.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href={!isAuthenticated ? "/signin" : "/profile"}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-all duration-300"
                  >
                    Upload Your Resume
                  </a>
                  <a
                    href={!isAuthenticated ? "/signin" : "/jobs"}
                    className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300"
                  >
                    Browse Jobs
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;