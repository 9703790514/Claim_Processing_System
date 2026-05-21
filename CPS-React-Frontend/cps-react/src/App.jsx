// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Login from './Components/Login';
// import CustomerHeader from './Components/Customer/CustomerHeader';
// import HospitalHeader from './Components/Hospital/HospitalHeader';

// // Simple page wrappers to include headers
// function CustomerPage() {
//   return (
//     <>
//       <CustomerHeader />
//       {/* <div style={{ padding: 20 }}>
//         <h1>Welcome, Customer!</h1>
//       </div> */}
//     </>
//   );
// }

// function HospitalPage() {
//   return (
//     <>
//       <HospitalHeader />
//       {/* <div style={{ padding: 20 }}>
//         <h1>Welcome, Hospital Staff!</h1>
//       </div> */}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/customer" element={<CustomerPage />} />
//         <Route path="/hospital" element={<HospitalPage />} />
//         <Route path="*" element={<h2>404 - Page Not Found</h2>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./Components/LandingPage"; // Import your new component
import Login from "./Components/Login";
import CustomerHeader from "./Components/Customer/CustomerHeader";
import HospitalHeader from "./Components/Hospital/HospitalHeader";
import AdminPage from "./Components/AdminPage";
import Level1OfficerDashboardPage from "./Level1OfficerComponents/Level1OfficerDashboardPage";
import Level2OfficerDashboardPage from "./Level2OfficerComponents/Level2OfficerDashboardPage";
import FieldDoctorDashboardPage from "./FieldOfficerComponents/FieldDoctorDashboardPage";

// Simple page wrappers to include headers
function CustomerPage() {
  return (
    <>
      <CustomerHeader />
    </>
  );
}

function HospitalPage() {
  return (
    <>
      <HospitalHeader />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />{" "}
        {/* Show landing page by default */}
        <Route path="/login" element={<Login />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/hospital" element={<HospitalPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/level1" element={<Level1OfficerDashboardPage />} />
        <Route path="/level2" element={<Level2OfficerDashboardPage />} />
        <Route path="/fielddoctor" element={<FieldDoctorDashboardPage />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
