// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ isAuthenticated, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="navbar-brand">RECIPE FINDER</Link>
      </div>
      <ul className="navbar-center-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/results">Recipe Results</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
      <div className="navbar-auth-links">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="auth-button">Logout</button>
        ) : (
          <>
            <Link to="/login" className="auth-button">Login</Link>
            <Link to="/signup" className="auth-button">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
