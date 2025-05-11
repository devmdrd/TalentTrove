import React, { useEffect } from "react";
import Header from "../../components/user/Header";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FAQ from "../../components/user/FAQ";
import BrandsGrid from "../../components/user/BrandsGrid";
import Features from "../../components/user/Features";
import Footer from "../../components/user/Footer";
import bannerImage from "../../assets/banner.png";
import { loginSuccess } from "../../features/auth/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");

    if (googleToken) {
      dispatch(loginSuccess({ token: googleToken }));
      navigate("/", { replace: true }); 
    }
  }, [dispatch, navigate]);

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bannerImage})`,
          opacity: 0.4,
          backgroundPosition: "center",
        }}
      />
      <div className="relative bg-white bg-opacity-90 min-h-screen">
        <Header />
        <div className="container mx-auto py-24 px-6 lg:px-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 lg:text-6xl">
              Get The <span className="text-indigo-600">Right Job</span> <br />
              You Deserve
            </h1>
            <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto">
              1100 jobs listed here! Your dream job is waiting for you to find it.
            </p>
          </div>
          {!isAuthenticated ? (
            <>
              <BrandsGrid />
              <FAQ />
            </>
          ) : (
            <Features />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
