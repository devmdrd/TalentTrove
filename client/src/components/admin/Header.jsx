import React from "react";
import {
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../services/adminServices";
import { clearData } from "../../features/auth/adminSlice";
import { FaUser, FaBriefcase } from "react-icons/fa";

function Header() {
  const { token } = useSelector((state) => state.adminAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await logout();
    if (response) {
      dispatch(clearData());
      navigate("/admin/signin");
    }
  };

  return (
    <nav className="flex flex-col sm:flex-row justify-between px-4 sm:px-10 py-2 sm:py-6 items-center bg-black bg-opacity-75">
      <div className="flex items-center">
        <Link
          to="/admin"
          className="text-xl text-white font-bold mb-4 sm:mb-0 cursor-pointer"
        >
          <span className="text-blue-500">TALENT</span>
          <span className="text-white">TROVE</span>
        </Link>
      </div>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6">
          {token ? (
            <>
              <li className="font-semibold text-white px-4 py-2 flex items-center">
                <FiBarChart2 className="h-6 w-6 mr-2" />
                Analytics
              </li>
              <li className="font-semibold text-white px-4 py-2 flex items-center">
                <FiSettings className="h-6 w-6 mr-2" />
                Settings
              </li>

              {/* Common Actions */}

              <li className="font-semibold text-white px-4 py-2 flex items-center">
                <FiUser className="h-6 w-6 mr-2" />
                Profile
              </li>
              <li className="ml-4" onClick={handleLogout}>
                <FiLogOut className="h-6 w-6 text-white cursor-pointer" />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to={"/signin"}
                  className="text-white bg-transparent border border-white rounded-md px-4 py-2 flex items-center hover:border-blue-500 hover:text-white transition duration-300"
                >
                  <FaUser className="mr-2" />
                  Candidate
                </Link>
              </li>
              <li>
                <Link
                  to={"/recruiter/signin"}
                  className="text-white bg-transparent border border-white rounded-md px-4 py-2 flex items-center hover:border-blue-500 hover:text-white transition duration-300"
                >
                  <FaBriefcase className="mr-2" /> Recruiter
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
