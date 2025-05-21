import React from "react";
import { FaFacebook, FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5" />, name: "Facebook", url: "#" },
    { icon: <FaTwitter className="w-5 h-5" />, name: "Twitter", url: "#" },
    { icon: <FaLinkedin className="w-5 h-5" />, name: "LinkedIn", url: "#" },
    { icon: <FaInstagram className="w-5 h-5" />, name: "Instagram", url: "#" },
    { icon: <FaGithub className="w-5 h-5" />, name: "GitHub", url: "#" },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", url: "#" },
        { name: "Careers", url: "#" },
        { name: "Blog", url: "#" },
        { name: "Press", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", url: "#" },
        { name: "Tutorials", url: "#" },
        { name: "Community", url: "#" },
        { name: "Events", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", url: "#" },
        { name: "Terms", url: "#" },
        { name: "Cookie Policy", url: "#" },
        { name: "GDPR", url: "#" },
      ],
    },
    {
      title: "Contact",
      links: [
        { name: "support@talenttrove.com", url: "mailto:support@talenttrove.com" },
        { name: "+91 (859) 068-7395", url: "tel:+918590687395" },
        { name: "Kerala, IN", url: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                <span className="text-blue-400">TALENT</span>TROVE
              </span>
            </div>
            <p className="text-gray-400">
              Connecting top talent with world-class companies. Find your dream job or your next star employee.
            </p>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Subscribe to our newsletter
              </h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-r-0 border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ y: -2 }}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} TalentTrove. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;