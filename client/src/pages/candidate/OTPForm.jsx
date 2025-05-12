import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPForm = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [otp, setOTP] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(() => {
    const saved = localStorage.getItem("otpTimer");
    return saved ? parseInt(saved, 10) : 30;
  });
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("otpTimer", timer.toString());
  }, [timer]);

  const startResendTimer = async () => {
    try {
      const response = await api.post('resend-otp', email);
      if (response.message === "OTP resent successfully") {
        setTimer(30);
        toast.success("OTP has been resent successfully.");
      }
    } catch (error) {
      toast.error("Error resending OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      toast.error("Please fill all OTP digits.");
      return;
    }
    try {
      const response = await api.post('verify-otp', { otp, email });
      if (response.success) {
        navigate("/signin", { state: { registrationSuccess: true } });
        localStorage.setItem("otpTimer", "30");
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleChange = (index, value) => {
    if (!isNaN(value) && value.length === 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      if (index < otp.length - 1) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      const updated = [...otp];
      updated[index] = "";
      setOTP(updated);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Verify Your Email
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Enter the 4-digit OTP sent to <span className="font-medium text-gray-800">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-4 gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  autoFocus={index === 0}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              {timer > 0 ? (
                <span className="text-sm text-gray-500">
                  Resend OTP in <span className="font-medium">{timer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={startResendTimer}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default OTPForm;
