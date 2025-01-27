import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            const response = await fetch(`/recipes/${id}`);
            const data = await response.json();
            setRecipe(data);
        };
        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{recipe.description}</h2>
            <img src={recipe.image_url} alt={recipe.description} />
            <p>{recipe.ingredients}</p>
            <p>Created by: {recipe.user_id}</p>
        </div>
    );
};

export default RecipeDetail;
