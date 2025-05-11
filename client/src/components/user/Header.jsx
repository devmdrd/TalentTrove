import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from 'jwt-decode'; 
import { FiMessageCircle, FiUser, FiBell, FiLogOut, FiCheckCircle, FiMenu, FiX } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { FaUser, FaBriefcase } from "react-icons/fa";
import api from "../../utils/axios";

function Header() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId; 
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter((n) => !n.read).length);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    fetchNotifications();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const response = await api.get("/logout");
      if (response.data?.success) {
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      const updated = notifications.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      );
      setNotifications(updated);
      setUnreadCount(updated.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const NotificationDropdown = () => (
    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-80 p-4 max-h-96 overflow-y-auto z-50">
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id} className="flex justify-between items-center py-2 border-b text-sm">
              <span className={`${notification.read ? "text-gray-400" : "font-semibold"}`}>
                {notification.message}
              </span>
              {!notification.read && (
                <FiCheckCircle onClick={() => handleMarkAsRead(notification._id)} className="text-green-500 cursor-pointer ml-2" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">
          <span className="text-blue-500">TALENT</span>TROVE
        </Link>
        <ul className="hidden md:flex space-x-6 items-center">
          {isAuthenticated ? (
            <>
              <li><Link to="/jobs" className="text-gray-700 hover:text-blue-500">Jobs</Link></li>
              <li><Link to="/my-jobs" className="text-gray-700 hover:text-blue-500">Applied</Link></li>
              <li><Link to="/saved-jobs" className="text-gray-700 hover:text-blue-500">Saved</Link></li>
              <li><Link to={`/${userId}/chat`}><FiMessageCircle className="text-gray-700 hover:text-blue-500" size={20} /></Link></li>
              <li className="relative">
                <FiBell className="text-gray-700 hover:text-blue-500 cursor-pointer" size={20} onClick={() => setShowDropdown(!showDropdown)} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">{unreadCount}</span>
                )}
                {showDropdown && <NotificationDropdown />}
              </li>
              <li><Link to="/profile"><FiUser className="text-gray-700 hover:text-blue-500" size={20} /></Link></li>
              <li onClick={handleLogout} className="cursor-pointer text-gray-700 hover:text-red-600"><FiLogOut size={20} /></li>
            </>
          ) : (
            <>
              <li><Link to="/signin" className="border px-4 py-2 rounded-md text-sm flex items-center text-gray-700 hover:border-blue-500 hover:text-blue-500"><FaUser className="mr-2" /> User Login</Link></li>
              <li><Link to="/company/signin" className="border px-4 py-2 rounded-md text-sm flex items-center text-gray-700 hover:border-blue-500 hover:text-blue-500"><FaBriefcase className="mr-2" /> Company Login</Link></li>
            </>
          )}
        </ul>
        <div className="md:hidden">
          {menuOpen ? (
            <FiX className="text-2xl cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <FiMenu className="text-2xl cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-50 z-50 px-4 py-6 shadow-lg rounded-b-xl space-y-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <Link to="/jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 text-gray-800 font-medium"><FiMessageCircle className="text-blue-500" /> Job Feed</Link>
              <Link to="/my-jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 text-gray-800 font-medium"><FaBriefcase className="text-blue-500" /> Applied Jobs</Link>
              <Link to="/saved-jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 text-gray-800 font-medium"><FiUser className="text-blue-500" /> Saved Jobs</Link>
              <Link to={`/${userId}/chat`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 text-gray-800 font-medium"><FiMessageCircle className="text-blue-500" /> Chat</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 text-gray-800 font-medium"><FiUser className="text-blue-500" /> Profile</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-red-50 text-red-600 font-medium"><FiLogOut /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 text-gray-800 font-medium"><FaUser className="text-blue-500" /> User Login</Link>
              <Link to="/company/signin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow hover:bg-blue-50 text-gray-800 font-medium"><FaBriefcase className="text-blue-500" /> Company Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;
