// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS

const LoginPage = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/login', user);
      const token = response.data.token; // Assuming your backend sends a token
      localStorage.setItem('token', token); // Store the token (e.g., localStorage)
      history.push('/dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data.error || 'Login failed');
    }
  };

  return (
    <div className="login-container"> {/* Wrapping container */}
      <div className="login-form"> {/* Form container */}
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message with class */}
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;