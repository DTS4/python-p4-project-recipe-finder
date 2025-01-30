import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/profile', { credentials: 'include' });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Failed to check authentication', err);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Fetch recipes only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchRecipes = async () => {
        try {
          const response = await fetch('/recipes', { credentials: 'include' });
          if (!response.ok) throw new Error('Failed to fetch recipes');
          const data = await response.json();
          setRecipes(data);
        } catch (err) {
          setError('Failed to load recipes.');
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
    }
  }, [isAuthenticated]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header>
        <h1>Welcome to Recipe Finder!</h1>
        <p>Discover amazing recipes handpicked for you!</p>
      </header>

      <section className="search-section">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </section>

      {/* Display recipes if authenticated */}
      {isAuthenticated && (
        <section className="featured-recipes">
          <h2>Featured Recipes</h2>
          {loading ? (
            <p>Loading recipes...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredRecipes.length > 0 ? (
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <img
                    src={recipe.image_url || 'https://res.cloudinary.com/dulnfomcr/image/upload/v1738158416/download_2_qgx3sy.jpg'}
                    alt={recipe.title}
                  />
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <Link to={`/recipe/${recipe.id}`} className="recipe-link">View Recipe</Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No recipes found.</p>
          )}
        </section>
      )}

      {/* About Recipe Finder Section */}
      <section className="about-recipe-finder">
        <div className="text">
          <h2>What is Recipe Finder?</h2>
          <p>Recipe Finder helps you discover and organize recipes effortlessly. It's designed for home cooks and professional chefs alike, helping them find the best recipes quickly!</p>
          <ul>
            <li>Browse thousands of recipes with ease</li>
            <li>Save your favorite recipes for later</li>
            <li>Share your creations with others</li>
          </ul>
        </div>
        <div className="image-container">
          <img src="https://res.cloudinary.com/dulnfomcr/image/upload/v1738158416/download_2_qgx3sy.jpg" alt="Recipe Finder" />
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <div className="image-container">
          <img src="https://res.cloudinary.com/dulnfomcr/image/upload/v1738158416/download_zolibn.jpg" alt="About Us" />
        </div>
        <div className="text">
          <h2>About Us</h2>
          <p>We are passionate about making cooking easier and more enjoyable for everyone. Our goal is to provide easy-to-use tools for finding and sharing recipes.</p>
          <ul>
            <li>Accessible for all skill levels</li>
            <li>Committed to fresh, easy-to-follow recipes</li>
            <li>Dedicated to improving your cooking experience</li>
          </ul>
        </div>
      </section>

      {/* User Feedback Section */}
      <section className="user-feedback">
        <h2>What People Are Saying</h2>
        <p>Our users love Recipe Finder! Here are just a few of the glowing reviews:</p>

        <div className="reviews">
          <div className="review">
            <p>"⭐⭐⭐⭐⭐ Recipe Finder is a game changer! I used to spend hours looking for recipes. Now, with just a few clicks, I can find everything I need and more. The personalized recommendations are spot on!"</p>
            <p><strong>- Sarah L., Home Cook</strong></p>
          </div>

          <div className="review">
            <p>"⭐⭐⭐⭐ Recipe Finder made meal planning so much easier. I love being able to organize my recipes and create shopping lists directly from the app!"</p>
            <p><strong>- David M., Busy Parent</strong></p>
          </div>

          <div className="review">
            <p>"⭐⭐⭐⭐⭐ This app has helped me discover new recipes I never would have thought to try. Plus, the ratings and reviews from other users are incredibly helpful!"</p>
            <p><strong>- Emma K., Culinary Enthusiast</strong></p>
          </div>
        </div>

        <p>But don’t just take our word for it—join the Recipe Finder community and see for yourself how it can transform your cooking experience!</p>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us">
        <h2>Why Choose Recipe Finder?</h2>
        <p>Have questions? Reach us at recipefinder@gmail.com</p>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
