import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory instead of useNavigate
import './HomePage.css';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory(); // Use useHistory instead

  // Fetch recipes from the backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleViewRecipe = (id) => {
    history.push(`/recipe/${id}`); // Use history.push() for navigation
  };

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <div>
      <header>
        <h1>Welcome to Recipe Finder!</h1>
        <p>Discover amazing recipes handpicked for you!</p>
      </header>

      <section className="search-section">
        <h2>Search for Your Favorite Recipes</h2>
        <form>
          <input type="text" placeholder="Search recipes..." />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="featured-recipes">
        <h2>Featured Recipes</h2>
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img
                src={recipe.image || recipe.imageUrl}
                alt={recipe.title || recipe.name}
                className="recipe-image"
              />
              <div className="recipe-info">
                <h3>{recipe.title || recipe.name}</h3>
                <p>{recipe.description}</p>
                <button
                  onClick={() => handleViewRecipe(recipe.id)}  
                  className="recipe-link"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
