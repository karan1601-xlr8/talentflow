import React from "react";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Features from "../components/sections/Features";
import JobExplore from "../components/sections/JobExplore";
import Layout from "../components/layout/Layout";

const Landing: React.FC = () => {
  return (
    <>
      <Layout>
        <Hero />
        <About />
        <Features />
        <JobExplore />
      </Layout>
    </>
  );
};

export default Landing;
