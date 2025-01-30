import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";  
import "./DashboardPage.css";

const DashboardPage = ({ user, setUser }) => {
  const history = useHistory();
  const [recipes, setRecipes] = useState([]);

   
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5000/recipes?user_id=${user?.id}`");
        if (!response.ok) throw new Error("Failed to fetch recipes");
        const data = await response.json();
        setRecipes(data);  
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // Function to update recipe list after form submission
  const handleNewRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user?.name || "User"}!</h1>
        <p>Your central hub for all things Recipe Finder.</p>
      </header>

      <section className="dashboard-content">
        {/* Recipe Submission Form */}
        <h2>Add a New Recipe</h2>
        <RecipeForm onSuccess={handleNewRecipe} />

        {/* Display submitted recipes */}
        <h2>My Recipes</h2>
        <ul>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <li key={recipe.id} className="recipe-item">
                <h3>{recipe.title}</h3>
                <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
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
