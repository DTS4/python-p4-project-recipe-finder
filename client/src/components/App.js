// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './NavBar';  
import HomePage from '../pages/HomePage';  
import RecipeResultsPage from '../pages/RecipeResultsPage';  
import DashboardPage from '../pages/DashboardPage';  
import SignupPage from '../pages/SignupPage';  
import LoginPage from '../pages/LoginPage';  

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
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import { UserProvider, useUser } from "./UserContext";  
// import NavBar from "./NavBar";
// import HomePage from "../pages/HomePage";
// import RecipeResultsPage from "../pages/RecipeResultsPage";
// import DashboardPage from "../pages/DashboardPage";
// import SignupPage from "../pages/SignupPage";
// import LoginPage from "../pages/LoginPage";

// const App = () => {
//   return (
//     <UserProvider>   
//       <Router>
//         <div>
//           <NavBar />
//           <Switch>
//             <Route exact path="/" component={HomePage} />
//             <Route path="/results" component={RecipeResultsPage} />
//             <Route path="/dashboard" component={DashboardPageWithUser} />
//             <Route path="/signup" render={() => <SignupPage />} />
//             <Route path="/login" render={() => <LoginPage />} />
//           </Switch>
//         </div>
//       </Router>
//     </UserProvider>
//   );
// };

// // Wrap DashboardPage with user data
// const DashboardPageWithUser = () => {
//   const { user, setUser } = useUser();

//   return user ? <DashboardPage user={user} setUser={setUser} /> : <Redirect to="/login" />;
// };

// export default App;
