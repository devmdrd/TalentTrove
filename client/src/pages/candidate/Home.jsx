import React from "react";
import Header from "../../components/candidate/Header";
import { useSelector } from "react-redux";
import FAQ from "../../components/candidate/FAQ";
import BrandsGrid from "../../components/candidate/BrandsGrid";
import Features from "../../components/candidate/Features";
import Footer from "../../components/candidate/Footer";
import bannerImage from "../../assets/banner.png";

const Home = () => {
  const { token } = useSelector((state) => state.candidateAuth);

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})`, opacity: 0.5 }}
      />
      <div className="relative bg-white bg-opacity-75 min-h-screen">
        <Header />
        <div className="container mx-auto py-20">
          <div className="text-center mb-16">
            <h1 className="text-8xl font-extrabold text-gray-800 lg:text-6xl">
              Get The <span className="text-blue-500">Right Job</span> <br />
              You Deserve
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              1100 jobs listed here! Your dream job is waiting...
            </p>
          </div>
          {!token && (
            <>
              <BrandsGrid />
              <FAQ />
            </>
          )}
          {token && <Features />}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
