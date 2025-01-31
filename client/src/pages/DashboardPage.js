// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import RecipeForm from "../components/RecipeForm"; 
// import './DashboardPage.css'

// const Dashboard = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [showForm, setShowForm] = useState(false); 

//   useEffect(() => {
//     axios.get("/recipes")
//       .then(response => {
//         setRecipes(response.data);
//       })
//       .catch(err => {
//         console.error("Error fetching recipes:", err);
//       });
//   }, []);

//   const handleToggleForm = () => {
//     setShowForm(!showForm); 
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this recipe?")) {
//       axios.delete(`/recipes/${id}`)
//         .then(response => {
//           setRecipes(recipes.filter(recipe => recipe.id !== id)); // Remove the deleted recipe from the state
//         })
//         .catch(err => {
//           console.error("Error deleting recipe:", err);
//         });
//     }
//   };

//   return (
//     <div>
//       <h2>Dashboard</h2>
      
//       {/* Toggle button to show or hide the recipe form */}
//       <button onClick={handleToggleForm}>
//         {showForm ? "Cancel" : "Add New Recipe"}
//       </button>

//       {/* Show the RecipeForm if showForm is true */}
//       {showForm && <RecipeForm />}

//       <h3>Your Recipes</h3>
//       <ul>
//         {recipes.length > 0 ? (
//           recipes.map((recipe) => (
//             <li key={recipe.id}>
//               <h4>{recipe.title}</h4>
//               <p>{recipe.ingredients}</p>
//               <img src={recipe.image_url} alt={recipe.title} width="100" />
//               <div>
//                 <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>
//                 <button onClick={() => handleDelete(recipe.id)}>Delete</button>
//               </div>
//             </li>
//           ))
//         ) : (
//           <p>No recipes found. Add some recipes!</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RecipeForm from "../components/RecipeForm"; 
import './DashboardPage.css';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get("/recipes")
      .then(response => {
        setRecipes(response.data);
      })
      .catch(err => {
        console.error("Error fetching recipes:", err);
      });
  }, []);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

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
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <button onClick={handleToggleForm}>
        {showForm ? "Cancel" : "Add New Recipe"}
      </button>

      {showForm && <RecipeForm />}

      <h3>Your Recipes</h3>
      <ul className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <li className="recipe-item" key={recipe.id}>
              <div>
                <h4>{recipe.title}</h4>
                <p>{recipe.ingredients}</p>
              </div>
              <img src={recipe.image_url} alt={recipe.title} width="100" />
              <div>
                <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(recipe.id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p className="empty-state">No recipes found. Add some recipes!</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;

