import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../../services/adminServices";
import { useDispatch } from "react-redux";
import { setData } from "../../features/auth/adminSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signin({ email, password });
      dispatch(setData(response.token));
      toast.success("Login successful!");
      navigate("/admin");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
              placeholder="Email address"
              style={{ transition: "all 0.3s ease" }} // Optional: Add transition effect
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
              placeholder="Password"
              style={{ transition: "all 0.3s ease" }}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
           
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SigninForm;
