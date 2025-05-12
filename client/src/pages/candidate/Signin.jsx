import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";
import api, { BASE_URL } from "../../utils/axios";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from "../../features/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/candidate/Header";
import Footer from "../../components/candidate/Footer";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get("error");
    const message = queryParams.get("message");

    if (location.state?.registrationSuccess) {
      toast.success("Account created successfully!");
    }
    if (error) toast.error(error);
    if (message) toast.success(message);

    if (error || message || location.state?.registrationSuccess) {
      queryParams.delete("error");
      queryParams.delete("message");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
      const { data } = await api.post("/signin", credentials);

      if (data?.token) {
        dispatch(loginSuccess({ token: data.token }));
        navigate("/", { replace: true });
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

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google?state=signin`;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <ToastContainer />
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <FaLock className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaGoogle className="mr-2 text-blue-500" />
              Continue with Google
            </button>

            <div className="mt-6 relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <span className="relative bg-white px-2 text-sm text-gray-500">
                Or continue with email
              </span>
            </div>

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

              <div className="flex justify-end text-sm">
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white rounded-md shadow-sm bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signin;
