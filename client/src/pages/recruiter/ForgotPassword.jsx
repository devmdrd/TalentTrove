import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/recruiter/Header";
import Footer from "../../components/recruiter/Footer";
import { forgotPassword } from "../../services/recruiterServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword({ email });
      toast.success("Password reset instructions sent to your email.");
      navigate("/recruiter/signin");
    } catch (error) {
      console.error("Error occurred while resetting password:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Forgot password?
            </h1>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-6">
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
                disabled={loading}
              >
                {loading ? "Sending..." : "Reset password"}
              </button>
            </form>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Remember your password?{" "}
              <Link
                to="/recruiter/signin"
                className="text-blue-600 font-semibold hover:underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
