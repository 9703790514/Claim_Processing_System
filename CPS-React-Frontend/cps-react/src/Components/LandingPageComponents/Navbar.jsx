// import React from "react";
// import "./Navbar.css";
// import Logo from "../../assets/logo.svg";
// import { Link } from "react-scroll";
// import { Link as RouterLink } from "react-router-dom";
// import { Link as ScrollLink } from "react-scroll";


// const Navbar = () => {
//   return (
//     <>
//       <div className="navbar">
//         <div className="logo">
//           <img className="logo-image radius" src={Logo} alt="madan" />
//         </div>
//         <div className="nav-buttons">
//           <p style={{ color: "white" }}>
//             <Link
//               to="home"
//               color="white"
//               smooth={true}
//               underline="none"
//               duration={500}
//               offset={-70}
//             >
//               Home
//             </Link>
//           </p>

//           <p>
//             <Link
//               to="about"
//               color="white"
//               smooth={true}
//               duration={500}
//               underline="none"
//               offset={-70}
//             >
//               About
//             </Link>
//           </p>
//           <p>
//             <Link
//               to="services"
//               color="white"
//               smooth={true}
//               duration={500}
//               offset={-70}
//               spy={true}
//               activeClass="active"
//             >
//               Services
//             </Link>
//           </p>
//           <p>
//             <Link
//               to="faq"
//               color="white"
//               smooth={true}
//               duration={500}
//               underline="none"
//               offset={-70}
//             >
//               FAQ
//             </Link>
//           </p>
//           <p>
//             {" "}
//             <Link
//               to="contact"
//               color="white"
//               smooth={true}
//               duration={500}
//               underline="none"
//               offset={-70}
//             >
//               Contact
//             </Link>{" "}
//           </p>
//         </div>
//         <div className="login">
//           <p>Login</p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;

import React from "react";
import "./Navbar.css";
import Logo from "../../assets/logo.svg";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img className="logo-image radius" src={Logo} alt="madan" />
      </div>
      <div className="nav-buttons">
        <p style={{ color: "white" }}>
          <ScrollLink to="home" smooth={true} duration={500} offset={-70}>
            Home
          </ScrollLink>
        </p>
        <p>
          <ScrollLink to="about" smooth={true} duration={500} offset={-70}>
            About
          </ScrollLink>
        </p>
        <p>
          <ScrollLink
            to="services"
            smooth={true}
            duration={500}
            offset={-70}
            spy={true}
            activeClass="active"
          >
            Services
          </ScrollLink>
        </p>
        <p>
          <ScrollLink to="faq" smooth={true} duration={500} offset={-70}>
            FAQ
          </ScrollLink>
        </p>
        <p>
          <ScrollLink to="contact" smooth={true} duration={500} offset={-70}>
            Contact
          </ScrollLink>
        </p>
      </div>
      <div className="login">
        <RouterLink to="/login" style={{ color: "white", textDecoration: "none" }}>
          Login
        </RouterLink>
      </div>
    </div>
  );
};

export default Navbar;
