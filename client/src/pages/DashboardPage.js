import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
// import RecipeForm from "../components/RecipeForm";
import "./DashboardPage.css";

const DashboardPage = ({ user, setUser }) => {
  const history = useHistory();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/login");
      return;
    }

    if (!user) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/user", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
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

  useEffect(() => {
    if (user?.id) {
      const fetchRecipes = async () => {
        try {
          const response = await fetch("/recipes");
          if (!response.ok) throw new Error("Failed to fetch recipes");

          const data = await response.json();
          setRecipes(data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };

      fetchRecipes();
    }
  }, [user?.id]);

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
        {/* <RecipeForm onSuccess={handleNewRecipe} /> */}

        <h2>My Recipes</h2>
        <ul>
          {recipes.length > 0 ? (
            recipes.slice(0, 5).map((recipe) => (
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
