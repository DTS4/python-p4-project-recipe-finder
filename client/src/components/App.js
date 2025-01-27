import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './NavBar';  
import HomePage from '../pages/HomePage';  
import RecipeResultsPage from '../pages/RecipeResultsPage';  
import DashboardPage from '../pages/DashboardPage';  
import SignupPage from '../pages/SignUpPage';  
import LoginPage from '../pages/LoginPage';  

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

   const handleLogin = () => {
    setIsAuthenticated(true);  
  };

   const handleLogout = () => {
    setIsAuthenticated(false);  
  };

  return (
    <Router>
      <div>
        <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
