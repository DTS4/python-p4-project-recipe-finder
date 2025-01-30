// import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import RecipeForm from "../components/RecipeForm";
// import "./DashboardPage.css";

// const DashboardPage = ({ user, setUser }) => {
//   const history = useHistory();
//   const [recipes, setRecipes] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       if (!user) {
//         const fetchUserData = async () => {
//           try {
//             const response = await fetch("/user", {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             if (response.ok) {
//               const data = await response.json();
//               setUser(data);  
//             } else {
//               history.push("/login");
//             }
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//             history.push("/login");
//           }
//         };

//         fetchUserData();
//       }
//     } else {
//       history.push("/login");
//     }
//   }, [user, setUser, history]);  

//   useEffect(() => {
//     if (user?.id && recipes.length === 0) {
//       const fetchRecipes = async () => {
//         try {
//           const response = await fetch(`/recipes?user_id=${user.id}`);
//           if (!response.ok) throw new Error("Failed to fetch recipes");
//           const data = await response.json();
//           setRecipes(data);
//         } catch (error) {
//           console.error("Error fetching recipes:", error);
//         }
//       };

//       fetchRecipes();
//     }
//   }, [user?.id, recipes.length]); 

//   const handleNewRecipe = (newRecipe) => {
//     setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/logout", { method: "POST" });
//       if (response.ok) {
//         setUser(null);
//         localStorage.removeItem("token");
//         history.push("/login");
//       }
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header>
//         <h1>Welcome, {user?.username || "User"}!</h1>
//         <p>Your central hub for all things Recipe Finder.</p>
//       </header>

//       <section className="dashboard-content">
//         <RecipeForm onSuccess={handleNewRecipe} />

//         <h2>My Recipes</h2>
//         <ul>
//           {recipes.length > 0 ? (
//             recipes.map((recipe) => (
//               <li key={recipe.id} className="recipe-item">
//                 <h3>{recipe.title}</h3>
//                 <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
//                 <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
//                 <p><strong>Instructions:</strong> {recipe.instructions}</p>
//               </li>
//             ))
//           ) : (
//             <p>No recipes added yet.</p>
//           )}
//         </ul>
//       </section>

//       <footer>
//         <button className="logout-button" onClick={handleLogout}>
//           Log Out
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import RecipeForm from "../components/RecipeForm";
// import "./DashboardPage.css";

// const DashboardPage = ({ user, setUser }) => {
//   const history = useHistory();
//   const [recipes, setRecipes] = useState([]);

//   // Fetch user data and handle token
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       if (!user) {
//         const fetchUserData = async () => {
//           try {
//             const response = await fetch("/user", {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             if (response.ok) {
//               const data = await response.json();
//               setUser(data);  
//             } else {
//               history.push("/login");
//             }
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//             history.push("/login");
//           }
//         };

//         fetchUserData();
//       }
//     } else {
//       history.push("/login");
//     }
//   }, [user, setUser, history]);

//   // Fetch recipes once when the user data is available
//   useEffect(() => {
//     if (user?.id && recipes.length === 0) {
//       const fetchRecipes = async () => {
//         try {
//           const response = await fetch(`/recipes?user_id=${user.id}`);
//           if (!response.ok) throw new Error("Failed to fetch recipes");
//           const data = await response.json();
//           setRecipes(data);
//         } catch (error) {
//           console.error("Error fetching recipes:", error);
//         }
//       };

//       fetchRecipes();
//     }
//   }, [user?.id, recipes.length]);

//   const handleNewRecipe = (newRecipe) => {
//     setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/logout", { method: "POST" });
//       if (response.ok) {
//         setUser(null);
//         localStorage.removeItem("token");
//         history.push("/login");
//       }
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header>
//         <h1>Welcome, {user?.username || "User"}!</h1>
//         <p>Your central hub for all things Recipe Finder.</p>
//       </header>

//       <section className="dashboard-content">
//         <RecipeForm onSuccess={handleNewRecipe} />

//         <h2>My Recipes</h2>
//         <ul>
//           {recipes.length > 0 ? (
//             recipes.map((recipe) => (
//               <li key={recipe.id} className="recipe-item">
//                 <h3>{recipe.title}</h3>
//                 <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
//                 <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
//                 <p><strong>Instructions:</strong> {recipe.instructions}</p>
//               </li>
//             ))
//           ) : (
//             <p>No recipes added yet.</p>
//           )}
//         </ul>
//       </section>

//       <footer>
//         <button className="logout-button" onClick={handleLogout}>
//           Log Out
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default DashboardPage;


import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import "./DashboardPage.css";

const DashboardPage = ({ user, setUser }) => {
  const history = useHistory();
  const [recipes, setRecipes] = useState([]);

  console.log("Dashboard Rendered"); // Debugging to see re-renders

  // Fetch user data only once
  useEffect(() => {
    console.log("User Effect Running"); // Debugging

    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/login");
      return;
    }

    if (!user) {
      const fetchUserData = async () => {
        try {
          console.log("Fetching User Data..."); // Debugging
          const response = await fetch("/user", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("User Data Fetched:", data);
            setUser(data);
          } else {
            console.log("Invalid token, redirecting...");
            localStorage.removeItem("token");
            history.push("/login");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          history.push("/login");
        }
      };

      fetchUserData();
    }
  }, [user, setUser, history]);

  // Fetch recipes only if user exists
  useEffect(() => {
    if (user?.id) {
      console.log("Fetching Recipes for User ID:", user.id); // Debugging

      const fetchRecipes = async () => {
        try {
          const response = await fetch("/recipes");
          if (!response.ok) throw new Error("Failed to fetch recipes");

          const data = await response.json();
          console.log("Recipes Fetched:", data.length);
          setRecipes(data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };

      fetchRecipes();
    }
  }, [user?.id]); // ✅ No recipes.length dependency

  // Prevent unnecessary re-renders when adding a new recipe
  const handleNewRecipe = useCallback((newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        localStorage.removeItem("token");
        history.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user?.username || "User"}!</h1>
        <p>Your central hub for all things Recipe Finder.</p>
      </header>

      <section className="dashboard-content">
        <RecipeForm onSuccess={handleNewRecipe} />

        <h2>My Recipes</h2>
        <ul>
          {recipes.length > 0 ? (
            recipes.slice(0, 5).map((recipe) => ( // ✅ Only show 5 to check performance
              <li key={recipe.id} className="recipe-item">
                <h3>{recipe.title}</h3>
                {recipe.image_url && (
                  <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
                )}
                <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p><strong>Instructions:</strong> {recipe.instructions}</p>
              </li>
            ))
          ) : (
            <p>No recipes added yet.</p>
          )}
        </ul>
      </section>

      <footer>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </footer>
    </div>
  );
};

export default DashboardPage;
