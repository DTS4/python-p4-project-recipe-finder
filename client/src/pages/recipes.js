import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/recipes'); // Assuming your backend is proxied
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recipes-container">
      <h2>Recipe List</h2>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
