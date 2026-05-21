// import React from 'react';
// import './About.css';

// const About = () => {
//   return (
//     <div className="about-container">
//       <div className="about-header">
//         <h2>About Sun Health and Allied Insurance</h2>
//         <p className="about-subtitle">
//           India's First Standalone Health Insurer, Trusted by Millions Since 2006
//         </p>
//       </div>
//       <div className="about-content">
//         <div className="about-section">
//           <h3>Company Overview</h3>
//           <p>
//             Founded in 2006 and headquartered in Chennai, Sun Health and Allied Insurance is a joint venture between leading Indian venture capitalists (Sun Health Investments, ICICI Venture, Sequoia Capital) and international investors (Oman Insurance Company, ETA Ascon Group). As India’s first standalone health insurance company, Sun Health is committed to providing quality service and innovative health solutions for individuals, families, and corporates across the nation.
//           </p>
//         </div>
//         <div className="about-section about-highlight">
//           <h3>Key Achievements</h3>
//           <ul>
//             <li>Pan-India presence with <b>160+ branches</b> (expanding to 200)</li>
//             <li>Comprehensive portfolio including: Sun Unique Health, Wedding Gift, Medi Classic, Diabetes Safe, Family Health Optima, Senior Citizen Red Carpet, Super Surplus, Sun Netplus, Sun Health Gain, and Sun Criticare Plus</li>
//             <li><b>Senior Citizen Red Carpet</b> plan: Specially designed for ages 60–69, with Sum Assured up to ₹5 lakhs</li>
//             <li>Robust distribution network and most plans available online</li>
//             <li>Recognized for <b>award-winning claims service</b> and customer-centric processes</li>
//           </ul>
//         </div>
//         <div className="about-section">
//           <h3>Product Portfolio</h3>
//           <ul>
//             <li><b>Health Insurance:</b> Wide range of plans covering hospitalization, critical illness, family, diabetes, and senior citizens</li>
//             <li><b>Travel Insurance:</b> Covers medical and travel emergencies abroad for families, students, and corporates</li>
//             <li><b>Accident Cover:</b> Financial protection in case of accidental injuries</li>
//           </ul>
//         </div>
//         <div className="about-section about-financials">
//           <h3>Financial Highlights (as of 2014)</h3>
//           <ul>
//             <li>Total premium (H1 FY2011): <b>₹3,868 million</b></li>
//             <li>Profit before tax (H1 FY2011): <b>₹320 million</b></li>
//             <li>Claims handled (2013–14): <b>361,538</b></li>
//             <li>Claims settlement ratio (2013–14): <b>69%</b> (industry average: 70–80%)</li>
//           </ul>
//           <p className="about-note">
//             <i>
//               The claims settlement ratio is a critical metric to assess reliability—Sun Health’s strong track record demonstrates its commitment to customers.
//             </i>
//           </p>
//         </div>
//         <div className="about-section about-management">
//           <h3>Leadership</h3>
//           <ul>
//             <li><b>Managing Director:</b> V Janannathan</li>
//             <li><b>Chief Financial Officer:</b> Lakshmanaswamy S</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;



import React from 'react';
import './About.css';

const About = () => {
  return (
    <div id='about' className="about-container">
      <div className="about-header">
        <h2>About Sun Health and Allied Insurance</h2>
        <p className="about-subtitle">
          India's First Standalone Health Insurer, Trusted by Millions Since 2006
        </p>
        <div className="about-section">
          <p>
            Founded in 2006 and headquartered in Chennai, Sun Health and Allied Insurance is a joint venture between leading Indian venture capitalists (Sun Health Investments, ICICI Venture, Sequoia Capital) and international investors (Oman Insurance Company, ETA Ascon Group). As India’s first standalone health insurance company, Sun Health is committed to providing quality service and innovative health solutions for individuals, families, and corporates across the nation.
          </p>
        </div>
      </div>
      <div className="about-grid">
        <div className="about-card about-achievements">
          <h3>Key Achievements</h3>
          <ul>
            <li>Pan-India presence with <b>160+ branches</b> (expanding to 200)</li>
            <li>Recognized for award-winning claims service</li>
            <li>Most plans available online</li>
            <li>Customer-centric processes</li>
          </ul>
        </div>
        <div className="about-card about-products">
          <h3>Product Portfolio</h3>
          <ul>
            <li><b>Health Insurance:</b> Sun Unique Health, Medi Classic, Diabetes Safe, Family Health Optima, Senior Citizen Red Carpet, Super Surplus, Sun Netplus, Sun Health Gain, Sun Criticare Plus</li>
            <li><b>Travel Insurance:</b> For families, students, corporates</li>
            <li><b>Accident Cover:</b> Financial protection for accidental injuries</li>
          </ul>
        </div>
        <div className="about-card about-financials">
          <h3>Financial Highlights</h3>
          <ul>
            <li>Total premium (H1 FY2011): <b>₹3,868 million</b></li>
            <li>Profit before tax (H1 FY2011): <b>₹320 million</b></li>
            <li>Claims handled (2013–14): <b>361,538</b></li>
            <li>Claims settlement ratio (2013–14): <b>69%</b></li>
          </ul>
        </div>
        <div className="about-card about-management">
          <h3>Leadership</h3>
          <ul>
            <li><b>Managing Director:</b> V Janannathan</li>
            <li><b>Chief Financial Officer:</b> Lakshmanaswamy S</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
