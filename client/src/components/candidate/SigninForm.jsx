import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../../services/candidateServices";
import authenticationImage from "../../assets/authentication.webp";
import { useLocation } from "react-router-dom";
import { setToken } from "../../features/auth/candidateSlice";

const SigninForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess || false;
  const token = useSelector((state) => state.candidateAuth.token);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Registration Successful", { position: "top-right" });
    }
  }, [registrationSuccess]);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!credentials.email || !credentials.password) {
        toast.error("Please fill all the fields");
        return;
      }

      const response = await signin(credentials);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      dispatch(setToken(response.token));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const handleGoogleLogin = () => {
    try {
      // Directly initiate OAuth flow from the client-side
      window.location.href = `https://talenttrove-9jlw.onrender.com/auth/google`;
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
            <Link
              to=""
              className="border-b-gray-700 border-b-4 pb-2 text-2xl font-bold text-gray-900"
            >
              {" "}
              Signin{" "}
            </Link>
          </div>
          <div className="lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0">
            <p className="text-left text-3xl font-bold">Welcome back...</p>
            <p className="mt-2 text-left text-gray-500">
              Welcome back, please enter your details.
            </p>
{/*             <button
              className="-2 mt-8 flex items-center justify-center rounded-md border px-4 py-2 outline-none ring-gray-400 ring-offset-2 transition focus:ring-2 hover:border-transparent hover:bg-black hover:text-white"
              onClick={handleGoogleLogin} // Handle Google login when button is clicked
            >
              <img
                className="mr-2 h-5"
                src="https://static.cdnlogo.com/logos/g/35/google-icon.svg"
                alt=""
              />
              Log in with Google
            </button> */}
            <div className="relative mt-8 flex h-px place-items-center bg-gray-200">
              <div className="absolute left-1/2 h-6 w-14 -translate-x-1/2 bg-white text-center text-sm text-gray-500">
                or
              </div>
            </div>
            <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleLogin}>
              <div className="flex flex-col pt-4">
                <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-12 flex flex-col pt-4">
                <div className="focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full flex-1 appearance-none border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
                <Link
                  to="/forgot-password"
                  className="text-gray-600 text-sm mt-2 underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2"
              >
                Signin
              </button>
            </form>
            <div className="py-12 text-center">
              <p className="whitespace-nowrap text-gray-600">
                Don't have an account?
                <Link
                  to="/signup"
                  className="underline-offset-4 font-semibold text-gray-900 underline"
                >
                  Sign up for free.
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2">
          <img
            className="-z-1 absolute top-0 h-full w-full object-cover opacity-90"
            src={authenticationImage}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SigninForm;
