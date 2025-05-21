import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import api from "../../utils/axios";
import { loginRequest, loginSuccess, loginFailure } from "../../features/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/admin/Header";
import Footer from "../../components/admin/Footer";

const SigninForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [credentials, setCredentials] = useState({ email: "admin@talenttrove.com", password: "Admin@123" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const { email, password } = credentials;
  
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
  
    setIsLoading(true);
    dispatch(loginRequest());
  
    try {
      const { data } = await api.post("/admin/signin", credentials);
  
      if (data?.token) {
        dispatch(loginSuccess({ token: data.token }));
        navigate("/admin", { replace: true });
      } else {
        toast.error("Login failed. Please try again.");
        dispatch(loginFailure("No token received"));
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      dispatch(loginFailure(err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <FaLock className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Login</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="mt-6 space-y-2" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white rounded-md shadow-sm bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Signing in..." : <>Sign in <FaArrowRight className="ml-2" /></>}
            </button>
          </form>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default SigninForm;
