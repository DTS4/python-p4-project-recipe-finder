import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = ({ handleLogin }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/signup', user, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Make sure credentials (cookies) are included in the request
      });

      if (response.status === 201) {
        alert('Signup successful');
        handleLogin(response.data.username); // Pass the username to App.js
        history.push('/dashboard'); // Redirect to dashboard
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Signup</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Email"
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;


 