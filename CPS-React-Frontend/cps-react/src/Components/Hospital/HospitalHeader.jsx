
import React, { useState } from 'react';
// import RecentClaims from './RecentClaims';
// import PolicyDetails from './PolicyDetails';
import Profile from '../Profile';
// Assuming these components exist for routing
import ReimbursementComponent from '../Customer/ReimbursementComponent';

import Cps from "../../assets/Cps.jpg"; // Your logo import
import PreAuthorization from './PreAuthorization ';
import MedicalInformation from './MedicalInformation';
import AdmitPatients from './AdmitPatients ';
import ClaimTracking from './ClaimTracking';
import HospitalHomepage from './HospitalHomepage';
import Photo from "../../assets/SunilPhoto.jpg";

export default function HospitalHeader() {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // State to manage current page
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const hospitalId = localStorage.getItem("hospitalId");
  


  // Header styles
  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: '#1A3E72',
      borderBottom: '2px solid #1A3E72',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '0 20px', // Add some horizontal padding
      height: '80px', // Fixed height for the header
    },
    logoAndNavContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px', // Space between logo and nav buttons
    },
    companyLogo: {
      backgroundColor: '#1A3E72',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderRadius: '8px',
      padding: '5px 0', // Padding around the image, not the whole div
    },
    companyLogoHover: {
      backgroundColor: '#2A4E82', // Slightly darker on hover
      transform: 'translateY(-1px)'
    },
    title: {
      color: '#FFFFFF',
      fontSize: '28px',
      fontWeight: '700',
      margin: '0',
      textAlign: 'center',
      flex: '1',
      padding: '0 20px', // Adjust padding as needed
    },
    profileButton: {
      backgroundColor: '#FFFFFF',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginRight: '10px', // Adjust margin to separate from edge
      overflow: 'hidden', // This ensures the image stays within the circular boundary
      padding: '0' // Remove any padding that might interfere with the circular shape
    },
    profileButtonHover: {
      backgroundColor: 'rgb(150, 171, 171)',
      transform: 'scale(1.05)'
    },
    headerImage: {
      width: '120px',
      height: '60px', // Adjust height to fit within header
      maxWidth: '100%',
      objectFit: 'contain',
     
      display: 'block'
    },
    profileImage: {
      width: '100%', // Fill the entire button width
      height: '100%', // Fill the entire button height
      objectFit: 'cover', // This will crop the image to fit the circle while maintaining aspect ratio
      borderRadius: '50%', // Make the image itself circular
      border: 'none' // Remove any border from the image
    },
    profileText: {
      color: '#000000',
      fontWeight: '600',
      fontSize: '12px',
      textAlign: 'center',
      lineHeight: '1.2'
    },
    profileContainer: {
      position: 'relative',
      display: 'inline-block'
    },
    profileDropdown: {
      position: 'absolute',
      top: '60px',
      right: '0',
      zIndex: 1000,
      backgroundColor: '#FFFFFF',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      minWidth: '200px', // Ensure dropdown has enough width
      padding: '10px' // Padding inside dropdown
    },
    navButton: {
      padding: '8px 15px',
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      border: '1px solid #FFFFFF', // White border for navigation buttons
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    navButtonActive: {
      backgroundColor: '#FFFFFF', // Active button background
      color: '#1A3E72', // Active button text color
      fontWeight: 'bold',
    },
  };

  // Routing logic
  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedClaim(null); // Reset selected claim when navigating
  };

  // Logo click resets to home
  const handleLogoClick = () => {
    setCurrentPage('home');
    setSelectedClaim(null);
  };

  // Render page content based on route
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
          return <HospitalHomepage />
      case 'reimbursement':
        return <ReimbursementComponent/>; // Assuming ReimbursementComponent doesn't need onNavigate here
      case 'preAuth':
        return <PreAuthorization onNavigate={handleNavigate} />
 // Assuming ViewHospitals doesn't need onNavigate here
      case 'admitPatients':
        return <AdmitPatients />; // Assuming ViewHospitals doesn't need onNavigate here
      case 'medicalInformation':
        return <MedicalInformation />; // Assuming ViewHospitals doesn't need onNavigate here
      case 'trackClaimStatus':
        return <ClaimTracking hospitalId={hospitalId} />;
      default:
        return (
          <>
            <RecentClaims onClaimSelect={setSelectedClaim} />
            {!selectedClaim && <PolicyDetails />}
          </>
        );
    }
  };

  // Calculate the height of the fixed header for padding the content
  // Using a fixed height from styles for consistency.
  const headerHeight = styles.header.height; // '80px'

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logoAndNavContainer}>
          <div
            style={{
              ...styles.companyLogo,
              ...(hoveredLogo ? styles.companyLogoHover : {})
            }}
            onMouseEnter={() => setHoveredLogo(true)}
            onMouseLeave={() => setHoveredLogo(false)}
            onClick={handleLogoClick}
          >
           
            <img src={Cps} alt="Company Logo" style={styles.headerImage} />
            
          </div>

          {/* Navigation Buttons directly in the header */}
          <button
            onClick={() => handleNavigate('home')}
            style={{ ...styles.navButton, ...(currentPage === 'home' ? styles.navButtonActive : {}) }}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate('medicalInformation')}
            style={{ ...styles.navButton, ...(currentPage === 'medicalInformation' ? styles.navButtonActive : {}) }}
          >
            Medical Information
          </button>
         
          <button
            onClick={() => handleNavigate('preAuth')}
            style={{ ...styles.navButton, ...(currentPage === 'preAuth' ? styles.navButtonActive : {}) }}
          >
            Pre Authorization
          </button>
          <button
            onClick={() => handleNavigate('admitPatients')}
            style={{ ...styles.navButton, ...(currentPage === 'admitPatients' ? styles.navButtonActive : {}) }}
          >
            Admit Patients
          </button>
          <button
            onClick={() => handleNavigate('reimbursement')}
            style={{ ...styles.navButton, ...(currentPage === 'reimbursement' ? styles.navButtonActive : {}) }}
          >
            Cash Less
          </button>
          <button
            onClick={() => handleNavigate('trackClaimStatus')}
            style={{ ...styles.navButton, ...(currentPage === 'trackClaimStatus' ? styles.navButtonActive : {}) }}
          >
            Track Claim status
          </button>
           {/* <button
            onClick={() => handleNavigate('claimQuery')}
            style={{ ...styles.navButton, ...(currentPage === 'claimQuery' ? styles.navButtonActive : {}) }}
          >
            Claim Query
          </button> */}
        </div>

        {/* Removed the main title as navigation buttons are present,
            or you can keep it and adjust layout with flex grow/shrink if needed */}
        {/* <h1 style={styles.title}>
          Healthcare Insurance Claim Management System
        </h1> */}

        <div style={styles.profileContainer}>
          <button
            style={{
              ...styles.profileButton,
              ...(hoveredProfile ? styles.profileButtonHover : {})
            }}
            onMouseEnter={() => setHoveredProfile(true)}
            onMouseLeave={() => setHoveredProfile(false)}
            onClick={() => setShowProfile(!showProfile)}
          >
            <img src={Photo} alt="Profile" style={styles.profileImage} />
          </button>
          {showProfile && (
            <div style={styles.profileDropdown}>
              <Profile hospitalId={hospitalId}  />
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area - adjusted padding-top to account for the fixed header's height */}
      <main style={{ paddingTop: headerHeight, minHeight: 'calc(100vh - ' + headerHeight + ')' }}>
        {renderCurrentPage()}
      </main>
    </>
  );
}