import React, { useState, useEffect } from 'react';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRecipes = async () => {
        const response = await fetch(`/recipes?search=${search}&ingredient=${ingredient}&page=${page}`);
        const data = await response.json();
        setRecipes(data);
    };

    useEffect(() => {
        fetchRecipes();
    }, [search, ingredient, page]);

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search Recipes" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Filter by Ingredient" 
                value={ingredient} 
                onChange={(e) => setIngredient(e.target.value)} 
            />
            <div>
                {recipes.map((recipe) => (
                    <div key={recipe.id}>
                        <h3>{recipe.description}</h3>
                        <img src={recipe.image_url} alt={recipe.description} />
                        <p>{recipe.ingredients}</p>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default RecipeList;
