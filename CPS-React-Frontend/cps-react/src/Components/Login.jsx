
import React, { useState } from "react";
import axios from "axios";
import FieldDoctorDashboardPage from "../FieldOfficerComponents/FieldDoctorDashboardPage";
import Level1OfficerDashboardPage from "../Level1OfficerComponents/Level1OfficerDashboardPage";
import Level2OfficerDashboardPage from "../Level2OfficerComponents/Level2OfficerDashboardPage";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, buildQueryParams } from "../utils/api";
import "./login.css";
 
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    console.log(email);
    console.log(password);
 
    e.preventDefault();
    setError("");
    setLoading(true);
 
    try {
      // Using API Gateway - Customer login endpoint
      const response = await axios.get(
        `${API_ROUTES.CUSTOMER.LOGIN}${buildQueryParams({
          customer_email: email,
          customer_password: password,
        })}`
      );
 
      if (response.status === 200 && response.data) {
        setRole(response.data.role.toLowerCase());
        setLoggedInUser(response.data);
        localStorage.setItem("userId", response.data._id);
        localStorage.setItem("hospitalId", response.data.email);
 
        setLoading(false);
        console.log(role);
    
        
       
        
      }
    } catch (error) {
      if (error.status === 404) {
        console.log("in eslse if block");
 
        alert("No User Found 😔");
      } else {
        alert("Login Failed " + error);
      }
    }
 
    console.log(loggedInUser);
 
    // console.log(localStorage.getItem("userId"));
    console.log(localStorage.getItem("hospitalId"));
    
 
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
 
    setLoading(false);
  };
 
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("userId");
    setRole("");
    setEmail("");
    setPassword("");
    setError("");
  };
 
  if (loggedInUser && role) {
    switch (role) {
      case "fieldofficer":
        return (
          <FieldDoctorDashboardPage
            email={email}
            currentFieldDoctorId={loggedInUser.id}
            loggedInUserData={loggedInUser}
            onLogout={handleLogout}
          />
        );
      case "level1officer":
        return (
          <Level1OfficerDashboardPage
            email={email}
            currentLevel1OfficerId={loggedInUser.id}
            loggedInUserData={loggedInUser}
            onLogout={handleLogout}
          />
        );
      case "level2officer":
        return (
          <Level2OfficerDashboardPage
            email={email}
            currentLevel2OfficerId={loggedInUser.id}
            loggedInUserData={loggedInUser}
            onLogout={handleLogout}
          />
        );
      case "policyholder":
        return navigate("/customer");
      case "hospitaluser":
        return navigate("/hospital");
      case "admin":
        return navigate("/admin");
      default:
        return <div>Unknown role: {role}</div>;
    }
  }
 
  return (
    <div className="loginpage-container">
      <form onSubmit={handleLogin} className="loginpage-form">
        <h2>User Login</h2>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
       
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
 
export default LoginPage;
 