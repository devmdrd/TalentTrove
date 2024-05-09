import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authenticationImage from "../../assets/authentication.webp";
import { signup } from "../../services/candidateServices";

const LoadingSpinner = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 opacity-50 z-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, mobile, password, confirmPassword } = details;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!validateMobile(mobile)) {
      toast.error("Invalid mobile number format");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Password validation
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one digit and one special character"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await signup(details);
      console.log("Signup successful");
      navigate(`/otp-form/${email}`);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="flex flex-wrap">
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
            <Link
              to=""
              className="border-b-gray-700 border-b-4 pb-2 text-2xl font-bold text-gray-900"
            >
              Signup
            </Link>
          </div>
          <div className="lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0">
            <p className="text-left text-3xl font-bold">Welcome back...</p>
            <p className="mt-2 text-left text-gray-500">
              Welcome back, please enter your details.
            </p>

            <form
              className="flex flex-col pt-3 md:pt-8"
              onSubmit={handleSignup}
              noValidate
            >
              <InputField
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={details.name}
                onChange={handleChange}
                required
              />
              <InputField
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={details.email}
                onChange={handleChange}
                required
              />
              <InputField
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Mobile No"
                value={details.mobile}
                onChange={handleChange}
                required
              />
              <InputField
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={details.password}
                onChange={handleChange}
                required
              />
              <InputField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={details.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2"
              >
                Signup
              </button>
            </form>
            <div className="py-12 text-center">
              <p className="whitespace-nowrap text-gray-600">
                Already have an account?
                <Link
                  to="/signin"
                  className="underline-offset-4 font-semibold text-gray-900 underline"
                >
                  Signin
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2">
          <img
            className="-z-1 absolute top-0 h-full w-full object-cover opacity-90"
            src={authenticationImage}
            alt=""
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

const InputField = ({
  type,
  id,
  name,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <div className="flex flex-col pt-4">
    <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
      <input
        type={type}
        id={id}
        name={name}
        className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  </div>
);

export default SignupForm;
