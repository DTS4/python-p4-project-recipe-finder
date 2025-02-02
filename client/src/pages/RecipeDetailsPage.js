// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./RecipeDetailsPage.css"; 

// const RecipeDetailsPage = () => {
//   const { id } = useParams(); 
//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch(`/recipes/${id}`) 
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Failed to fetch recipe");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Recipe data:", data); // Debugging: Log the data
//         setRecipe(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching recipe:", err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <h2 className="loading">Loading...</h2>;
//   if (error) return <h2 className="error">{error}</h2>;
//   if (!recipe) return <h2 className="error">Recipe not found</h2>;

//   // Ensure ingredients is an array before calling .map()
//   const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

//   return (
//     <div className="recipe-container">
//       <h1 className="recipe-title">{recipe.title}</h1>
//       <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      
//       <div className="recipe-section">
//         <h2>Ingredients</h2>
//         <ul>
//           {ingredients.map((ingredient, index) => (
//             <li key={index}>{ingredient}</li>
//           ))}
//         </ul>
//       </div>
      
//       <div className="recipe-section">
//         <h2>Instructions</h2>
//         <p>{recipe.instructions}</p>
//       </div>
//     </div>
//   );
// };

// export default RecipeDetailsPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./RecipeDetailsPage.css"; 

const RecipeDetailsPage = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/recipes/${id}`) 
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch recipe");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Recipe data:", data); // Debugging: Log the data
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipe:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <h2 className="error">{error}</h2>;
  if (!recipe) return <h2 className="error">Recipe not found</h2>;

  // Ensure ingredients is an array before calling .map()
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  return (
    <div className="recipe-container">
      <h1 className="recipe-title">{recipe.title}</h1>
      {/* Use recipe.image_url if the backend returns image_url instead of image */}
      <img src={recipe.image_url || recipe.image} alt={recipe.title} className="recipe-image" />
      
      <div className="recipe-section">
        <h2>Ingredients</h2>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div className="recipe-section">
        <h2>Instructions</h2>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;