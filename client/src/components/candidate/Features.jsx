import React from "react";
import { FiSearch, FiBriefcase, FiDollarSign, FiCheckCircle, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

function Features() {
  const features = [
    {
      icon: <FiSearch className="text-2xl" />,
      title: "Smart Job Matching",
      description: "Our AI-powered system matches your skills and preferences with the perfect job opportunities.",
    },
    {
      icon: <FiCheckCircle className="text-2xl" />,
      title: "Verified Employers",
      description: "We vet all employers to ensure you're applying to legitimate opportunities.",
    },
    {
      icon: <FiUser className="text-2xl" />,
      title: "Profile Visibility",
      description: "Let recruiters find you with our premium profile visibility options.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container px-6 py-10 mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Powerful Tools For Your <span className="text-blue-600">Job Search</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to find, apply, and land your dream job.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to accelerate your career?
              </h3>
              <p className="text-gray-600 mb-6">
                Create your free profile and get matched with top employers in your field.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Get Started - It's Free
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://res.cloudinary.com/dprxebwil/image/upload/v1681571472/9365666_4149593_oovvzj.jpg" 
                alt="Career growth" 
                className="rounded-lg shadow-md w-full h-auto"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Features;