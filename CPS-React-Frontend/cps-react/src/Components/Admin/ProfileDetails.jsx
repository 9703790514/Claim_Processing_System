import React, { useState, useRef, useEffect } from "react";
import { FaUserLarge } from "react-icons/fa6";
import "./ProfileDetails.css";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally clear auth state here
    navigate("/login"); // <-- Redirect to login page
  };

  // Handle clicks outside the profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="profile-btn-container" ref={profileRef}>
      <button
        className="profile-icon-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Show profile"
      >
        <FaUserLarge size={28} />
      </button>
      {open && (
        <div className="profile-dropdown">
          <h3 className="profile-title">Profile Details</h3>
          <p>
            <strong>Name: </strong> Madan
          </p>
          <p>
            <strong>Email: </strong> madan@gmail.com
          </p>
          <p>
            <strong>Role: </strong> Admin
          </p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
