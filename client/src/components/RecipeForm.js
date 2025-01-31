// import React, { useState, useEffect } from "react";
// import { useHistory, useParams } from "react-router-dom";
// import axios from "axios";
// import './RecipeForm.css'

// const RecipeForm = ({ user }) => {
//   const [recipe, setRecipe] = useState({
//     title: "",
//     ingredients: "",
//     instructions: "",
//     image_url: ""
//   });

//   const { recipeId } = useParams();
//   const history = useHistory();

//   useEffect(() => {
//     if (recipeId) {
//       // Fetch existing recipe data if updating
//       axios.get(`/recipes/${recipeId}`)
//         .then(response => {
//           setRecipe(response.data.recipe);
//         })
//         .catch(err => {
//           console.error("Error fetching recipe:", err);
//         });
//     }
//   }, [recipeId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRecipe({ ...recipe, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const url = recipeId ? `/recipes/${recipeId}` : "/recipes";
//     const method = recipeId ? "PATCH" : "POST";

//     axios({
//       method,
//       url,
//       data: recipe,
//     })
//       .then(response => {
//         history.push("/recipes");
//       })
//       .catch(err => {
//         console.error("Error saving recipe:", err);
//       });
//   };

//   return (
//     <div>
//       <h2>{recipeId ? "Edit Recipe" : "Add New Recipe"}</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Title:
//           <input
//             type="text"
//             name="title"
//             value={recipe.title}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Ingredients:
//           <textarea
//             name="ingredients"
//             value={recipe.ingredients}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Instructions:
//           <textarea
//             name="instructions"
//             value={recipe.instructions}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Image URL:
//           <input
//             type="text"
//             name="image_url"
//             value={recipe.image_url}
//             onChange={handleChange}
//           />
//         </label>
//         <button type="submit">{recipeId ? "Update Recipe" : "Create Recipe"}</button>
//       </form>
//     </div>
//   );
// };

// export default RecipeForm;

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import './RecipeForm.css';

const RecipeForm = ({ user }) => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    image_url: ""
  });

  const { recipeId } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (recipeId) {
      // Fetch existing recipe data if updating
      axios.get(`/recipes/${recipeId}`)
        .then(response => {
          setRecipe(response.data.recipe);
        })
        .catch(err => {
          console.error("Error fetching recipe:", err);
        });
    }
  }, [recipeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = recipeId ? `/recipes/${recipeId}` : "/recipes";
    const method = recipeId ? "PATCH" : "POST";

    axios({
      method,
      url,
      data: recipe,
    })
      .then(response => {
        history.push("/recipes"); 
      })
      .catch(err => {
        console.error("Error saving recipe:", err);
      });
  };

  return (
    <div className="recipe-form-container">
      <h2>{recipeId ? "Edit Recipe" : "Add New Recipe"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          required
        />
        <label>Ingredients:</label>
        <textarea
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          required
        />
        <label>Instructions:</label>
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          required
        />
        <label>Image URL:</label>
        <input
          type="text"
          name="image_url"
          value={recipe.image_url}
          onChange={handleChange}
        />
        <button type="submit">{recipeId ? "Update Recipe" : "Create Recipe"}</button>
      </form>
    </div>
  );
};

export default RecipeForm;
