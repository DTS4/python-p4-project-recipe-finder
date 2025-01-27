import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  // Function to simulate fetching data (replace this with actual API call later)
  const fetchFeaturedRecipes = () => {
    // Simulate fetching featured recipes from backend
    const recipes = [
      {
        id: 1,
        name: 'Butterscotch Cheesecake Bars',
        imageUrl: 'https://www.allrecipes.com/thmb/WJchMvY6jk-F_RszShKOyX4hTOw=/282x188/filters:no_upscale():max_bytes(150000):strip_icc()/234730-boonas-butterscotch-cheesecake-bars-71-1x1-18f8d2c5b0a54d469f00893a8a2c5c6d.jpg',
        description: 'A rich and creamy cheesecake topped with a butterscotch glaze.',
      },
      {
        id: 2,
        name: 'Classic Margherita Pizza',
        imageUrl: 'https://www.allrecipes.com/thmb/Td3ciIqu_lVxpwFEcgeac1g38ns=/282x188/filters:no_upscale():max_bytes(150000):strip_icc()/234730-classic-margherita-pizza-71-1x1-b8cd9a6f9a9b4b7db3be1b8fd72f5e7d.jpg',
        description: 'A simple yet flavorful pizza with fresh mozzarella, basil, and tomatoes.',
      },
      {
        id: 3,
        name: 'Spaghetti Carbonara',
        imageUrl: 'https://www.allrecipes.com/thmb/7lS9GbB_LvAlm8ldLjhrTpNJztg=/282x188/filters:no_upscale():max_bytes(150000):strip_icc()/234730-spaghetti-carbonara-71-1x1-c2a9f31b410d4c30b4f1a2d824635cb1.jpg',
        description: 'A creamy pasta dish with bacon, egg, and Parmesan.',
      }
    ];
    setFeaturedRecipes(recipes);
  };

  useEffect(() => {
    fetchFeaturedRecipes();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Here you could redirect to the recipe results page or filter recipes
    console.log('Searching for:', searchQuery);
    // Add functionality for search functionality
  };

  return (
    <div>
      {/* NavBar should already be included globally, so we don't need to repeat it */}
      <header>
        <h1>Welcome to Recipe Finder!</h1>
        <p>Search, discover, and save your favorite recipes from around the world!</p>
      </header>

      <section className="search-section">
        <h2>Find Your Next Favorite Recipe</h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="featured-recipes">
        <h2>Featured Recipes</h2>
        <div className="recipe-grid">
          {featuredRecipes.map((recipe) => (
            <div className="recipe-card" key={recipe.id}>
              <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
              <div className="recipe-info">
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
                <Link to={`/recipe/${recipe.id}`} className="recipe-link">View Recipe</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>&copy; 2025 Recipe Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
