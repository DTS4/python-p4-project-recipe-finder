import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get("/recipes")
      .then(response => {
        setRecipes(response.data);
      })
      .catch(err => {
        console.error("Error fetching recipes:", err);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      axios.delete(`/recipes/${id}`)
        .then(response => {
          setRecipes(recipes.filter(recipe => recipe.id !== id));
        })
        .catch(err => {
          console.error("Error deleting recipe:", err);
        });
    }
  };

  return (
    <div>
      <h2>Your Recipes</h2>
      <Link to="/recipes/new">Add New Recipe</Link>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.ingredients}</p>
            <img src={recipe.image_url} alt={recipe.title} width="100" />
            <div>
              <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>
              <button onClick={() => handleDelete(recipe.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
