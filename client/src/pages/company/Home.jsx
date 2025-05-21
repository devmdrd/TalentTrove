import React from "react";
import Header from "../../components/company/Header";
import Hero from "../../components/company/Hero";
import BrandsGrid from "../../components/candidate/BrandsGrid";
import Feature from "../../components/company/Feature";
import Footer from "../../components/company/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <BrandsGrid />
      <Feature />
      <Footer />
    </>
  );
};

export default Home;
