import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section footer-about">
          <h3>Sun Health & Allied Insurance</h3>
          <p>
            India's trusted standalone health insurer since 2006. Committed to quality service and comprehensive health coverage.
          </p>
        </div>
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:support@sunhealth.com">support@sunhealth.com</a></p>
          <p>Phone: <a href="tel:+911234567890">+91 12345 67890</a></p>
          <p>Headquarters: Chennai, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Sun Health & Allied Insurance. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
