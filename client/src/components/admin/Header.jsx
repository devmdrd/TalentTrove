import React, { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { FaUser, FaBriefcase } from "react-icons/fa";
import api from "../../utils/axios";

function Header() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const handleProfileClick = () => {
    setIsLogoutVisible((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      const response = await api.get("/admin/logout");
      if (response) {
        dispatch(logout());
        navigate("/admin/signin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  const renderAuthenticatedMenu = () => (
    <>
      <li
        className="relative cursor-pointer flex items-center gap-4"
        onClick={handleProfileClick}
      >
        <div className="relative inline-block bg-black rounded-full p-2">
          <FaUser className="w-6 h-6 text-gray-700" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {isLogoutVisible && (
          <div
            className="flex items-center gap-2 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </div>
        )}
      </li>
    </>
  );

  const renderUnauthenticatedMenu = () => (
    <>
      <Link
        to="/signin"
        onClick={closeMenu}
        className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 transition text-gray-800 font-medium"
      >
        <FaUser className="text-blue-500" /> User Login
      </Link>
      <Link
        to="/company/signin"
        onClick={closeMenu}
        className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 transition text-gray-800 font-medium"
      >
        <FaBriefcase className="text-blue-500" /> Company Login
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center px-6 py-4">
        <Link
          to="/admin/signin"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600"
        >
          <span className="text-blue-500">TALENT</span>TROVE
        </Link>

        <ul className="hidden md:flex space-x-6 items-center">
          {token ? renderAuthenticatedMenu() : renderUnauthenticatedMenu()}
        </ul>

        <div className="md:hidden">
          {menuOpen ? (
            <FiX className="text-2xl cursor-pointer" onClick={closeMenu} />
          ) : (
            <FiMenu className="text-2xl cursor-pointer" onClick={openMenu} />
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-50 z-50 px-4 py-6 shadow-lg rounded-b-xl space-y-3 border-t border-gray-200">
          {token ? renderAuthenticatedMenu() : renderUnauthenticatedMenu()}
        </div>
      )}
    </nav>
  );
}

export default Header;
