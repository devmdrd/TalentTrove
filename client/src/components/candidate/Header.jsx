import React, { useState, useEffect } from "react";
import {
  FiMessageCircle,
  FiUser,
  FiBell,
  FiLogOut,
  FiCheckCircle,
  // FiVideo,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/candidateServices";
import { clearToken } from "../../features/auth/candidateSlice";
import { getNotifications, markAsRead } from "../../services/candidateServices";
import { FaUser, FaBriefcase } from "react-icons/fa";

function Header() {
  const { token } = useSelector((state) => state.candidateAuth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { notifications, unreadCount } = await getNotifications();
        setNotifications(notifications);
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      dispatch(clearToken());
      navigate("/");
    }
  };

  const handleNotificationClick = async () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      const updatedNotifications = notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      setNotifications(updatedNotifications); // Update notifications state
      const updatedUnreadCount = updatedNotifications.filter(
        (notification) => !notification.read
      ).length; // Calculate unread count
      setUnreadCount(updatedUnreadCount); // Update unread count
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const NotificationDropdown = () => (
    <div className="absolute right-0 mt-8 bg-white shadow-lg rounded-lg w-72">
      <ul className="py-2 px-4">
        {notifications.map((notification, index) => (
          <li key={index}>
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              {!notification.read && (
                <FiCheckCircle
                  className="h-5 w-5 ml-2 text-green-500 cursor-pointer"
                  onClick={() => handleMarkAsRead(notification._id)}
                />
              )}
            </div>
            <hr className="my-2" />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <nav className="flex flex-col sm:flex-row justify-between px-4 sm:px-10 py-2 sm:py-6 items-center bg-black bg-opacity-75">
      <div className="flex items-center">
        <Link
          to="/"
          className="text-xl text-white font-bold mb-2 sm:mb-0 cursor-pointer"
        >
          <span className="text-blue-500">TALENT</span>
          <span className="text-white">TROVE</span>
        </Link>
      </div>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6">
          {token ? (
            <>
              <li>
                <Link
                  to="/job-feed"
                  className="font-semibold text-white hidden sm:block"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/my-jobs"
                  className="font-semibold text-white hidden sm:block"
                >
                  Applied{" "}
                </Link>
              </li>
              <li className="font-semibold text-white hidden sm:block">
                Saved
              </li>
              <li>
                <Link to="/chat">
                  <FiMessageCircle className="h-6 w-6 text-white" />
                </Link>
              </li>

              <li className="relative">
                <FiBell
                  className="h-6 w-6 text-white cursor-pointer"
                  onClick={handleNotificationClick}
                />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-xs text-white rounded-full px-1 py-0.5">
                    {unreadCount}
                  </span>
                )}
                {showNotificationDropdown && <NotificationDropdown />}
              </li>

              <li>
                <Link to="/profile" className="text-white">
                  <FiUser className="h-6 w-6 cursor-pointer" />
                </Link>
              </li>
              {/* <li>
                <Link to="/meeting">
                  <FiVideo className="h-6 w-6 text-white cursor-pointer" />
                </Link>
              </li> */}
              <li onClick={handleLogout}>
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
