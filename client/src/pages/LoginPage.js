import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";  // Keep this line unchanged
import "./LoginPage.css";

const LoginPage = ({ handleLogin }) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();  // This should work with v5

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLoginRequest = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user.username || !user.password) {
      setErrorMessage("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "/login",  
        user,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Login successful!");
        handleLogin(response.data.user);
        history.push("/recipes");  // Use history.push() to navigate
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleLoginRequest}>
          <input 
            type="text" 
            name="username" 
            value={user.username} 
            onChange={handleInputChange} 
            placeholder="Username" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            value={user.password} 
            onChange={handleInputChange} 
            placeholder="Password" 
            required 
          />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
