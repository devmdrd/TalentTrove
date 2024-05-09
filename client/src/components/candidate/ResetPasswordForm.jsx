import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/candidateServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({ password, token });
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
      toast.error("An error occurred. Please try again later.");
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
            Reset Password
          </h1>
          <p className="text-sm text-center text-gray-600 mb-8">
            Updated your password?{" "}
            <Link to="/signin" className="text-blue-600 font-medium">
              sign in
            </Link>
          </p>
          <form onSubmit={handleReset}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-600 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-600 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ResetPasswordForm;
