import React from "react";
import { FiMessageCircle, FiUser, FiBell, FiLogOut, FiVideo } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../services/recruiterServices";
import { clearToken } from "../../features/auth/recruiterSlice";
import { FaUser, FaBriefcase } from "react-icons/fa";

function Header() {
  const {token}  = useSelector((state) => state.recruiterAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    console.log("logout clicked");
    const response = await logout();
    if (response.success) {
      dispatch(clearToken());
      navigate("/recruiter/signin");
    }
  };
  const handleMeet = () => {
    navigate("/recruiter/meeting")
  };

  return (
    <nav className="flex flex-col sm:flex-row justify-between px-4 sm:px-10 py-2 sm:py-6 items-center bg-black bg-opacity-75">
      <div className="flex items-center">
      <Link
        to="/recruiter"
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
              <Link to="/recruiter/job-post">
                <li className="font-semibold text-white">Hire</li>
              </Link>
              <Link to="/recruiter/created-tests">
                <li className="font-semibold text-white">Skill Test</li>
              </Link>
              <Link to="/recruiter/posted-jobs">
                <li className="font-semibold text-white">Jobs Posted</li>
              </Link>
              <Link to="/recruiter/chat">
                <li>
                  <FiMessageCircle className="h-6 w-6 text-white" />
                </li>
              </Link>
              <li>
                <FiBell className="h-6 w-6 text-white" />
              </li>
              <li>
                <Link to="/recruiter/profile" className="text-white">
                  <FiUser className="h-6 w-6 cursor-pointer" />
                </Link>
              </li>
{/*               <li>
                <FiVideo className="h-6 w-6 text-white cursor-pointer" onClick={handleMeet} />
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
                   <FaBriefcase className="mr-2" />{" "}
                  Recruiter
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
