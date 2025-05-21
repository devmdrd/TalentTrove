import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from 'jwt-decode';
import {
  FiMessageCircle,
  FiUser,
  FiBell,
  FiLogOut,
  FiCheckCircle,
  FiMenu,
  FiX,
  FiSearch,
  FiPlus,
  FiBriefcase
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBriefcase } from "react-icons/fa";
import { logout } from "../../features/auth/authSlice";
import api from "../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { token } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let companyId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    companyId = decodedToken.userId;
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (token) {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token]);

  const handleLogout = async () => {
    const response = await api.get("/company/logout");
    if (response.data.success) {
      dispatch(logout());
      navigate("/company/signin");
    }
  };

  const handleMarkAsRead = (notificationId) => {
    const updated = notifications.map((n) =>
      n._id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);
  };

  const NotificationDropdown = () => (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl w-80 p-4 max-h-96 overflow-y-auto z-50 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={() => {
              notifications.forEach(n => !n.read && handleMarkAsRead(n._id));
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <motion.li 
              key={notification._id} 
              whileHover={{ scale: 1.01 }}
              className={`flex justify-between items-start p-3 rounded-lg ${
                notification.read ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <div className="flex-1">
                <p className={`text-sm ${
                  notification.read ? "text-gray-600" : "font-semibold text-gray-900"
                }`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <button 
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  aria-label="Mark as read"
                >
                  <FiCheckCircle className="w-4 h-4" />
                </button>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/company" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">TALENT</span>TROVE
              </span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
              {token && (
                <>
                  <Link 
                    to="/company/create-job" 
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <FiPlus className="mr-1" /> Post Job
                  </Link>
                  <Link 
                    to="/company/jobs" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    My Jobs
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4 ml-4">
            {token ? (
              <>
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
                
                <Link 
                  to={`/company/${companyId}/chat`}
                  className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  aria-label="Messages"
                >
                  <FiMessageCircle className="h-5 w-5" />
                </Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <FiBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showDropdown && <NotificationDropdown />}
                  </AnimatePresence>
                </div>
                
                <Link 
                  to="/company/profile"
                  className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  aria-label="Profile"
                >
                  <FiUser className="h-5 w-5" />
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Logout"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <span className="flex items-center">
                    <FaUser className="mr-2" /> User Login
                  </span>
                </Link>
                <Link 
                  to="/company/signin"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <span className="flex items-center">
                    <FaBriefcase className="mr-2" /> Company Login
                  </span>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {token && (
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 mr-2"
              >
                <FiSearch className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Menu"
            >
              {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search candidates..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg rounded-b-lg border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {token ? (
                <>
                  <Link
                    to="/company/create-job"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <FiPlus className="mr-2 text-blue-500" /> Post New Job
                  </Link>
                  <Link
                    to="/company/jobs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <FiBriefcase className="mr-2 text-blue-500" /> My Job Posts
                  </Link>
                  <Link
                    to={`/company/${companyId}/chat`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <FiMessageCircle className="mr-2 text-blue-500" /> Messages
                  </Link>
                  <Link
                    to="/company/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <FiUser className="mr-2 text-blue-500" /> Company Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <FaUser className="mr-2 text-blue-500" /> User Login
                  </Link>
                  <Link
                    to="/company/signin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <FaBriefcase className="mr-2 text-blue-500" /> Company Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Header;