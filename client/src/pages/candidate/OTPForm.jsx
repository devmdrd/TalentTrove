import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyOtp, resendOTP } from "../../services/candidateServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailVerificationForm = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [otp, setOTP] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(() => {
    const savedTimer = localStorage.getItem("otpTimer");
    return savedTimer ? parseInt(savedTimer, 10) : 30;
  });
  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    localStorage.setItem("otpTimer", timer.toString());
  }, [timer]);

  const startResendTimer = async () => {
    try {
      const response = await resendOTP(email);
      if (response.message === "OTP resent successfully") {
        setTimer(30);
        toast.success("OTP has been resent successfully.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("There was an error while resending OTP. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      // Show error message if OTP field is empty
      toast.error("Please enter the OTP.", { position: "top-right" });
      return;
    }
    try {
      const response = await verifyOtp({ otp, email });
      if (response.success) {
        // navigate("/signin");
        navigate("/signin", { state: { registrationSuccess: true } });
        localStorage.setItem("otpTimer", "30");
      }
    } catch (error) {
      console.error("Error during OTP validation:", error);
      toast.error("Invalid OTP. Please enter a valid OTP.", {
        position: "top-right",
      });
    }
  };

  const handleChange = (index, value) => {
    if (!isNaN(value) && value.length === 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (index < otp.length - 1 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.key === "Backspace") {
      const newOTP = [...otp];
      if (index > 0 && otp[index] === "") {
        newOTP[index - 1] = "";
        setOTP(newOTP);
        inputRefs.current[index - 1].focus();
      } else if (index === otp.length - 1 && otp[index] === "") {
        newOTP[index] = "";
        setOTP(newOTP);
        inputRefs.current[index].focus();
      } else {
        newOTP[index] = "";
        setOTP(newOTP);
      }
    }
  };

  const formatTime = (seconds) => {
    return seconds.toString().padStart(2, "0");
  };

  return (
    <>
      <div className="flex min-h-screen justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-16 h-16 text-center text-3xl font-semibold border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(index, e)}
                  ref={(input) => (inputRefs.current[index] = input)}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-sm">
                {timer > 0 ? (
                  <span>Resend OTP in {formatTime(timer)} seconds</span>
                ) : (
                  <button
                    type="button"
                    onClick={startResendTimer}
                    className="text-blue-500 hover:text-blue-600 focus:outline-none"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Verify OTP
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EmailVerificationForm;
