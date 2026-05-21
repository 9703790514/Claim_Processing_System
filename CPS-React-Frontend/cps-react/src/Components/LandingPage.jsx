import Navbar from "./LandingPageComponents/Navbar";
import Home from "./LandingPageComponents/Home";
import Services from "./LandingPageComponents/Services";
import About from "./LandingPageComponents/About";
import FAQ from "./LandingPageComponents/FAQ";
import Contact from "./LandingPageComponents/Contact";
import Footer from "./LandingPageComponents/Footer";


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Home />
      <Services />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
};

export default LandingPage;