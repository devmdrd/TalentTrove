import React from "react";
import Header from "../../components/recruiter/Header";
import Hero from "../../components/recruiter/Hero";
import BrandsGrid from "../../components/candidate/BrandsGrid";
import Feature from "../../components/recruiter/Feature";
import Footer from "../../components/recruiter/Footer";
// import Subscription from "../../components/recruiter/Subscription";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <BrandsGrid />
      <Feature />
      {/* <Subscription /> */}
      <Footer />
    </>
  );
};

export default Home;
