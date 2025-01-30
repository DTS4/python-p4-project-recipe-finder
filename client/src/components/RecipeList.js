import React from "react";

const RecipeList = ({ recipes }) => {
  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <img src={recipe.image_url} alt={recipe.title} />
          <p>{recipe.ingredients}</p>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
