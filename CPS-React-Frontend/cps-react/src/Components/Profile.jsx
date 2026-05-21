import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';


export default function ProfileMenu({hospitalId}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [hospitalDetails, setHospitalDetails] = useState([]);
    const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const handleLogout = () => {
    // Optionally clear auth state here
    navigate('/login'); // <-- Redirect to login page
  };

  useEffect(() => {
  if (!hospitalId) {
    console.warn('No hospitalId provided to ClaimTracking component');
    setError('Hospital ID is not available.');
    setLoading(false);
    return;
  }

  setLoading(true);
  fetch(`http://localhost:9196/api/hospitals/email/${hospitalId}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch claims');
      return res.json();
    })
    .then((data) => {
      setHospitalDetails(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, [hospitalId]); // 👈 include hospitalId as dependency
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Allowed image types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image (jpg, png, gif).');
      setImagePreview(null);
      return;
    }

    setError('');
    // Create a preview URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  const menuItems = [
    // { icon: '👤', label: 'Profile', onClick: () => console.log('Profile clicked') },
    // { icon: '❓', label: 'Help Center', onClick: () => console.log('Help Center clicked') },
    { icon: '🚪', label: 'Log Out', onClick: handleLogout }
  ];

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      width: '256px',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      padding: '16px',
      borderBottom: '1px solid #f3f4f6'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    profileImageContainer: {
      position: 'relative'
    },
    fileInput: {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      opacity: '0',
      cursor: 'pointer'
    },
    profileImage: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #fb923c'
    },
    profilePlaceholder: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#dc2626',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '18px'
    },
    userInfo: {
      flex: '1'
    },
    userName: {
      fontWeight: '600',
      color: '#111827',
      fontSize: '16px',
      margin: '0 0 2px 0'
    },
    userBatch: {
      color: '#f97316',
      fontSize: '14px',
      fontWeight: '500',
      margin: '0 0 2px 0'
    },
    userStatus: {
      color: '#6b7280',
      fontSize: '12px',
      margin: '0'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '8px',
      fontWeight: '500'
    },
    menuContainer: {
      paddingTop: '8px',
      paddingBottom: '8px'
    },
    menuItem: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      textAlign: 'left',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
      fontSize: '14px'
    },
    menuItemHover: {
      backgroundColor: '#f9fafb'
    },
    menuIcon: {
      fontSize: '18px'
    },
    menuLabel: {
      color: '#374151',
      fontWeight: '500'
    }
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          {/* Profile Image */}
          <div style={styles.profileImageContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                style={styles.profileImage}
              />
            ) : (
              <div style={styles.profilePlaceholder}>
                S
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div style={styles.userInfo}>
            <h3 style={styles.userName}>Name: {hospitalDetails.name}</h3>
            <p style={styles.userBatch}>ID: {hospitalDetails.id}</p>
            <p style={styles.userStatus}>contact: {hospitalDetails.contact}</p>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <p style={styles.errorMessage}>
            {error}
          </p>
        )}
      </div>

      {/* Menu Items */}
      <div style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          return (
            <button
              key={index}
              onClick={item.onClick}
              style={{
                ...styles.menuItem,
                ...(hoveredIndex === index ? styles.menuItemHover : {})
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              <span style={styles.menuLabel}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}