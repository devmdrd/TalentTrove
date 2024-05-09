import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../../services/candidateServices";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await forgotPassword({ email });
      if (response.message) {
        setTimeout(() => {
          setLoading(false);
          navigate("/signin");
        }, 1000);
      }
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
      toast.error(
        "An error occurred while resetting password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
            Forgot password?
          </h1>
          <p className="text-sm text-center text-gray-600 mb-8">
            Remember your password?{" "}
            <Link to="/signin" className="text-blue-600 font-medium">
              Login here
            </Link>
          </p>
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-600 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Enter your email address"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
