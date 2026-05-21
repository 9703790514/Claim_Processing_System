import React from "react";
import "./AdminNavbar.css";
import Logo from "../../assets/logo.svg";
import ProfileDetails from "./ProfileDetails";
 
const users = [
  { label: "Level 1", key: "level1" },
  { label: "Level 2", key: "level2" },
  { label: "PolicyDetail", key: "policydetail" },
  { label: "Hospitals", key: "hospitals" },
  { label: "Field Doctor", key: "fielddoctor" },
  { label: "Roles", key: "role" },
];
 
const AdminNavbar = ({ onNavigate, selectedPage }) => (
  <div className="navbar">
    <div className="logo">
      <img className="logo-image radius" src={Logo} alt="logo" />
    </div>
    <div className="nav-buttons">
      {users.map((user, index) => (
        <button
          key={index}
          onClick={() => onNavigate(user.key)}
          className={selectedPage === user.key ? "active" : ""}
          style={{
            color: "white",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: selectedPage === user.key ? "bold" : "normal",
          }}
        >
          {user.label}
        </button>
      ))}
    </div>
    <div className="login">
      <ProfileDetails />
    </div>
  </div>
);
 
export default AdminNavbar;