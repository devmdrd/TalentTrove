import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/recruiterServices";
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
      navigate("/recruiter/signin");
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Reset password
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Updated your password?{" "}
                <Link
                  to="/recruiter/signin"
                  className="text-blue-600 decoration-2 hover:underline font-medium"
                >
                  Click here
                </Link>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={handleReset}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      placeholder="Enter your new password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      value={confirmPassword}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      placeholder="Confirm your new password"
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default ResetPasswordForm;
