import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; 
import './RecipeResultsPage.css';

const RecipeResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory(); 

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/recipes', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipes.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleViewRecipe = (id) => {
    history.push(`/recipes/${id}`); 
  };

  const handleDeleteRecipe = async (id) => {
    try {
      const response = await fetch(`/recipes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      alert('Recipe deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Error deleting recipe');
    }
  };

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Recipe Results</h2>
      <div className="recipe-grid">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image_url || 'https://via.placeholder.com/150'} alt={recipe.title} className="recipe-image" />
              <div className="recipe-info">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <button onClick={() => handleViewRecipe(recipe.id)} className="recipe-link">
                  View Recipe
                </button>
                <button onClick={() => handleDeleteRecipe(recipe.id)} className="delete-recipe-button">
                  Delete Recipe
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found. Start adding some!</p>
        )}
      </div>
    </div>
  );
};

export default RecipeResults;
