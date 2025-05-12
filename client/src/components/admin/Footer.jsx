import React from "react";
import {
  FaFacebook,
  FaGithub,
  FaReddit,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-black bg-opacity-75 text-white">
      <div className="container p-6 mx-auto">
        <div className="lg:flex">
          <div className="w-full lg:w-2/5">
            <div className="px-6">
              <h2 className="text-2xl font-semibold">Join 31,000+ others</h2>
              <p className="mt-2 text-gray-300">
                Never miss out on new tips, tutorials, and more.
              </p>
              <div className="flex mt-6 space-x-4">
                <a
                  href="#"
                  className="text-gray-300 transition-colors duration-300 hover:text-blue-500"
                  aria-label="Reddit"
                >
                  <FaReddit className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 transition-colors duration-300 hover:text-blue-600"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 transition-colors duration-300 hover:text-gray-400"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 transition-colors duration-300 hover:text-blue-400"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 transition-colors duration-300 hover:text-blue-700"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 lg:flex-1">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold uppercase">About</h3>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Company
                </a>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Community
                </a>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Careers
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold uppercase">Blog</h3>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Tech
                </a>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Music
                </a>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Videos
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold uppercase">Products</h3>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Mega Cloud
                </a>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Aperion UI
                </a>
                <a href="#" className="block mt-2 text-sm text-gray-300 hover:underline">
                  Meraki UI
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold uppercase">Contact</h3>
                <span className="block mt-2 text-sm text-gray-300">
                  +91 1234509876
                </span>
                <span className="block mt-2 text-sm text-gray-300">
                  talenttrove@talenttrove.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />
        <div className="text-center">
          <p className="text-sm text-gray-300">
            © TalentTrove 2024 - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
