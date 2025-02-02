// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from '../pages/HomePage';
import RecipeResultsPage from '../pages/RecipeResultsPage';
import DashboardPage from '../pages/DashboardPage';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import RecipeDetailsPage from "../pages/RecipeDetailsPage";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (loggedInUsername) => {
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      <div>
        <NavBar isAuthenticated={isAuthenticated} username={username} handleLogout={handleLogout} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/results" component={RecipeResultsPage} />
          <Route path="/dashboard" render={() => (
            isAuthenticated ? <DashboardPage /> : <Redirect to="/login" />
          )} />
          <Route path="/signup" render={() => (
            isAuthenticated ? <Redirect to="/dashboard" /> : <SignupPage handleLogin={handleLogin} />
          )} />
          <Route path="/login" render={() => (
            isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage handleLogin={handleLogin} />
          )} />
          <Route path="/recipes/:id" component={RecipeDetailsPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

