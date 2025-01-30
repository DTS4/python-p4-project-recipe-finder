import React, { useState } from "react";
import './RecipeForm.css';

const RecipeForm = ({ onSuccess }) => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    image_url: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message
    setIsSubmitting(true);

    // Validation
    if (!recipe.title || !recipe.ingredients || !recipe.instructions || !recipe.image_url) {
      setErrorMessage("All fields are required!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) throw new Error("Failed to add recipe");

      const newRecipe = await response.json();
      onSuccess(newRecipe); // Callback to refresh UI after adding recipe
      setRecipe({ title: "", ingredients: "", instructions: "", image_url: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting recipe:", error);
      setErrorMessage("Failed to submit recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2>Add New Recipe</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Ingredients:</label>
          <textarea
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Instructions:</label>
          <textarea
            name="instructions"
            value={recipe.instructions}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image_url"
            value={recipe.image_url}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Add Recipe"}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
