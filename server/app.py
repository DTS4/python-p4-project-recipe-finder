from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from config import app, db
from models import User, Recipe, Favorite
from sqlalchemy import or_
import os

# Apply CORS globally to allow frontend access from specific origins
CORS(app, origins=["http://localhost:3000"])  # Match your frontend URL

# Configure database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.secret_key = os.environ.get("SECRET_KEY", "supersecretkey")
Session(app)

db.init_app(app)

# Sample recipe data (this would be your "in-memory" database)
recipes = [
    {
        "id": 1,
        "title": "Boonas Butterscotch Cheesecake Bars",
        "image": "https://example.com/recipe-image.jpg",
        "imageUrl": "https://example.com/recipe-image.jpg",
        "description": "Delicious butterscotch cheesecake bars.",
        "ingredients": [
            "1 package cream cheese",
            "1 cup sugar",
            "2 cups heavy cream",
            "2 cups butterscotch chips"
        ],
        "instructions": "Mix cream cheese and sugar, add heavy cream, melt butterscotch chips, and bake at 350F."
    },
    {
        "id": 2,
        "title": "Chocolate Chip Cookies",
        "image": "https://example.com/chocolate-chip-cookies.jpg",
        "imageUrl": "https://example.com/chocolate-chip-cookies.jpg",
        "description": "Classic chocolate chip cookies, crispy on the edges and soft in the center.",
        "ingredients": [
            "2 1/4 cups all-purpose flour",
            "1/2 cup granulated sugar",
            "1 cup brown sugar",
            "2 cups chocolate chips"
        ],
        "instructions": "Preheat oven to 350°F. Mix all ingredients and bake for 12 minutes."
    },
    {
        "id": 3,
        "title": "Spaghetti Carbonara",
        "image": "https://example.com/spaghetti-carbonara.jpg",
        "imageUrl": "https://example.com/spaghetti-carbonara.jpg",
        "description": "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
        "ingredients": [
            "1 lb spaghetti",
            "4 large eggs",
            "1 cup grated Parmesan cheese",
            "4 oz pancetta"
        ],
        "instructions": "Cook pasta, whisk eggs and cheese, sauté pancetta, and mix everything together."
    },
    # Add more recipes up to 30 here
    {
        "id": 4,
        "title": "Pasta Primavera",
        "image": "https://example.com/pasta-primavera.jpg",
        "imageUrl": "https://example.com/pasta-primavera.jpg",
        "description": "A fresh and colorful pasta dish with vegetables and a light sauce.",
        "ingredients": [
            "12 oz pasta",
            "1 cup cherry tomatoes",
            "1 cup zucchini",
            "1/2 cup Parmesan cheese"
        ],
        "instructions": "Cook pasta, sauté vegetables, toss together with sauce, and top with Parmesan."
    },
    {
        "id": 5,
        "title": "Chicken Alfredo",
        "image": "https://example.com/chicken-alfredo.jpg",
        "imageUrl": "https://example.com/chicken-alfredo.jpg",
        "description": "Rich and creamy Alfredo sauce with chicken over fettuccine.",
        "ingredients": [
            "1 lb fettuccine pasta",
            "2 chicken breasts",
            "2 cups heavy cream",
            "1 cup Parmesan cheese"
        ],
        "instructions": "Cook pasta, sauté chicken, make Alfredo sauce, and combine with pasta."
    },
    {
        "id": 6,
        "title": "Caesar Salad",
        "image": "https://example.com/caesar-salad.jpg",
        "imageUrl": "https://example.com/caesar-salad.jpg",
        "description": "Crisp lettuce with Caesar dressing, croutons, and Parmesan.",
        "ingredients": [
            "1 head Romaine lettuce",
            "1/2 cup Caesar dressing",
            "1/2 cup croutons",
            "1/4 cup Parmesan cheese"
        ],
        "instructions": "Toss lettuce with dressing, add croutons and cheese, and serve."
    },
    {
        "id": 7,
        "title": "Beef Stir Fry",
        "image": "https://example.com/beef-stir-fry.jpg",
        "imageUrl": "https://example.com/beef-stir-fry.jpg",
        "description": "A quick stir fry with beef and vegetables in a savory sauce.",
        "ingredients": [
            "1 lb beef",
            "2 cups mixed vegetables",
            "2 tbsp soy sauce",
            "1 tbsp sesame oil"
        ],
        "instructions": "Sauté beef, add vegetables, and stir fry with soy sauce and sesame oil."
    },
    {
        "id": 8,
        "title": "Vegetable Soup",
        "image": "https://example.com/vegetable-soup.jpg",
        "imageUrl": "https://example.com/vegetable-soup.jpg",
        "description": "A comforting and hearty vegetable soup.",
        "ingredients": [
            "4 cups vegetable broth",
            "2 cups mixed vegetables",
            "1 cup potatoes",
            "1 cup beans"
        ],
        "instructions": "Simmer vegetables in broth until tender, then serve."
    },
    {
        "id": 9,
        "title": "Fish Tacos",
        "image": "https://example.com/fish-tacos.jpg",
        "imageUrl": "https://example.com/fish-tacos.jpg",
        "description": "Light and fresh tacos with crispy fish and a tangy slaw.",
        "ingredients": [
            "1 lb fish fillets",
            "8 small tortillas",
            "1 cup coleslaw",
            "1/2 cup salsa"
        ],
        "instructions": "Cook fish, warm tortillas, assemble tacos, and top with slaw and salsa."
    },
    {
        "id": 10,
        "title": "Guacamole",
        "image": "https://example.com/guacamole.jpg",
        "imageUrl": "https://example.com/guacamole.jpg",
        "description": "A creamy avocado dip with lime and cilantro.",
        "ingredients": [
            "3 avocados",
            "1 lime",
            "1/4 cup cilantro",
            "1/4 cup onion"
        ],
        "instructions": "Mash avocados, mix with lime, cilantro, and onion."
    },
    {
        "id": 11,
        "title": "Beef Tacos",
        "image": "https://example.com/beef-tacos.jpg",
        "imageUrl": "https://example.com/beef-tacos.jpg",
        "description": "Ground beef tacos with a flavorful seasoning.",
        "ingredients": [
            "1 lb ground beef",
            "1 packet taco seasoning",
            "8 taco shells",
            "1/2 cup shredded cheese"
        ],
        "instructions": "Cook ground beef, add seasoning, and assemble tacos with toppings."
    },
    {
        "id": 12,
        "title": "Margarita Pizza",
        "image": "https://example.com/margarita-pizza.jpg",
        "imageUrl": "https://example.com/margarita-pizza.jpg",
        "description": "A simple and classic pizza with fresh mozzarella and basil.",
        "ingredients": [
            "1 pizza dough",
            "1/2 cup tomato sauce",
            "1 cup fresh mozzarella",
            "1/4 cup fresh basil"
        ],
        "instructions": "Top dough with sauce and cheese, bake at 450°F, and add basil after baking."
    },
    {
        "id": 13,
        "title": "Lemon Chicken",
        "image": "https://example.com/lemon-chicken.jpg",
        "imageUrl": "https://example.com/lemon-chicken.jpg",
        "description": "Juicy chicken with a tangy lemon sauce.",
        "ingredients": [
            "4 chicken breasts",
            "2 lemons",
            "1 cup chicken broth",
            "1 tbsp olive oil"
        ],
        "instructions": "Sauté chicken, add lemon juice and broth, simmer until cooked through."
    },
    {
        "id": 14,
        "title": "Eggplant Parmesan",
        "image": "https://example.com/eggplant-parmesan.jpg",
        "imageUrl": "https://example.com/eggplant-parmesan.jpg",
        "description": "A vegetarian classic with layers of eggplant, marinara sauce, and cheese.",
        "ingredients": [
            "2 eggplants",
            "1 jar marinara sauce",
            "2 cups mozzarella cheese",
            "1/4 cup Parmesan cheese"
        ],
        "instructions": "Bread and fry eggplant slices, layer with sauce and cheese, and bake at 375°F."
    },
    {
        "id": 15,
        "title": "Chicken Caesar Wraps",
        "image": "https://example.com/chicken-caesar-wraps.jpg",
        "imageUrl": "https://example.com/chicken-caesar-wraps.jpg",
        "description": "Grilled chicken with Caesar dressing wrapped in a tortilla.",
        "ingredients": [
            "2 chicken breasts",
            "1/4 cup Caesar dressing",
            "4 tortillas",
            "1 cup romaine lettuce"
        ],
        "instructions": "Grill chicken, slice, and wrap with dressing and lettuce in tortillas."
    },
    {
        "id": 16,
        "title": "Vegetable Stir Fry",
        "image": "https://example.com/vegetable-stir-fry.jpg",
        "imageUrl": "https://example.com/vegetable-stir-fry.jpg",
        "description": "A healthy and colorful stir fry with mixed vegetables.",
        "ingredients": [
            "2 cups mixed vegetables",
            "2 tbsp soy sauce",
            "1 tbsp sesame oil",
            "1/4 cup green onions"
        ],
        "instructions": "Stir fry vegetables in oil and soy sauce, top with green onions."
    },
    {
        "id": 17,
        "title": "Shrimp Scampi",
        "image": "https://example.com/shrimp-scampi.jpg",
        "imageUrl": "https://example.com/shrimp-scampi.jpg",
        "description": "Shrimp cooked in garlic butter and served with pasta.",
        "ingredients": [
            "1 lb shrimp",
            "3 tbsp butter",
            "4 cloves garlic",
            "8 oz spaghetti"
        ],
        "instructions": "Sauté shrimp in garlic butter, serve over cooked spaghetti."
    },
    {
        "id": 18,
        "title": "Pork Tenderloin",
        "image": "https://example.com/pork-tenderloin.jpg",
        "imageUrl": "https://example.com/pork-tenderloin.jpg",
        "description": "A perfectly roasted pork tenderloin with a simple seasoning.",
        "ingredients": [
            "1 lb pork tenderloin",
            "2 tbsp olive oil",
            "1 tbsp rosemary",
            "1 tsp salt"
        ],
        "instructions": "Season pork, roast at 400°F for 25-30 minutes, and rest before slicing."
    },
    {
        "id": 19,
        "title": "Spinach and Ricotta Stuffed Shells",
        "image": "https://example.com/spinach-ricotta-stuffed-shells.jpg",
        "imageUrl": "https://example.com/spinach-ricotta-stuffed-shells.jpg",
        "description": "Large pasta shells stuffed with spinach and ricotta, topped with marinara sauce.",
        "ingredients": [
            "12 large pasta shells",
            "1 cup ricotta cheese",
            "2 cups spinach",
            "1 jar marinara sauce"
        ],
        "instructions": "Stuff shells with ricotta and spinach, bake with marinara sauce at 375°F."
    },
    {
        "id": 20,
        "title": "Tomato Basil Soup",
        "image": "https://example.com/tomato-basil-soup.jpg",
        "imageUrl": "https://example.com/tomato-basil-soup.jpg",
        "description": "A smooth and creamy tomato soup with fresh basil.",
        "ingredients": [
            "4 cups tomato puree",
            "1 cup heavy cream",
            "1/4 cup basil",
            "1 onion"
        ],
        "instructions": "Simmer tomato puree and onion, blend with cream and basil."
    },
    {
    "id": 21,
    "title": "Beef Wellington",
    "image": "https://example.com/beef-wellington.jpg",
    "imageUrl": "https://example.com/beef-wellington.jpg",
    "description": "A showstopper dish with tender beef wrapped in puff pastry.",
    "ingredients": [
        "1 lb beef tenderloin",
        "1 package puff pastry",
        "1/2 cup mushrooms",
        "1/4 cup Dijon mustard"
    ],
    "instructions": "Sear beef, coat with mustard, wrap in mushrooms and puff pastry, and bake at 400°F."
},
{
    "id": 22,
    "title": "Chicken Pot Pie",
    "image": "https://example.com/chicken-pot-pie.jpg",
    "imageUrl": "https://example.com/chicken-pot-pie.jpg",
    "description": "A creamy chicken filling encased in a flaky, golden pie crust.",
    "ingredients": [
        "2 cups cooked chicken",
        "1 cup peas",
        "1 cup carrots",
        "1 pie crust"
    ],
    "instructions": "Combine chicken, peas, and carrots in a creamy sauce, top with pie crust, and bake at 375°F."
},
{
    "id": 23,
    "title": "Pulled Pork Sandwiches",
    "image": "https://example.com/pulled-pork-sandwiches.jpg",
    "imageUrl": "https://example.com/pulled-pork-sandwiches.jpg",
    "description": "Tender pulled pork served on a bun with barbecue sauce.",
    "ingredients": [
        "2 lbs pork shoulder",
        "1 cup barbecue sauce",
        "8 sandwich buns",
        "1/2 cup coleslaw"
    ],
    "instructions": "Slow cook pork until tender, shred, toss with barbecue sauce, and serve on buns with coleslaw."
},
{
    "id": 24,
    "title": "Shrimp Tacos",
    "image": "https://example.com/shrimp-tacos.jpg",
    "imageUrl": "https://example.com/shrimp-tacos.jpg",
    "description": "Crispy shrimp in soft tortillas with a tangy slaw and creamy sauce.",
    "ingredients": [
        "1 lb shrimp",
        "8 small tortillas",
        "1 cup cabbage slaw",
        "1/4 cup creamy sriracha sauce"
    ],
    "instructions": "Cook shrimp, warm tortillas, assemble tacos with slaw, and drizzle with creamy sriracha sauce."
}

]

# --- Home Route ---
@app.route('/')
def index():
    return '<h1>Project Server Running</h1>'

# --- Signup Route ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not all(key in data for key in ["username", "email", "password"]):
        return jsonify({"error": "Username, email, and password are required"}), 400

    hashed_password = generate_password_hash(data["password"], method="sha256")

    try:
        new_user = User(
            username=data["username"],
            email=data["email"],
            password_hash=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully", "user": {"id": new_user.id, "username": new_user.username, "email": new_user.email}}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username or email already exists"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# --- Login Route ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if user and check_password_hash(user.password_hash, data["password"]):
        session["user_id"] = user.id
        return jsonify({"message": "Login successful", "user": {"id": user.id, "username": user.username, "email": user.email}}), 200
    return jsonify({"error": "Invalid username or password"}), 401

# --- Logout Route ---
@app.route('/logout', methods=['POST'])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logout successful"}), 200

# --- Recipe Routes ---
@app.route('/recipes', methods=['GET'])
def get_recipes():
    return jsonify(recipes), 200

@app.route('/recipes/<int:id>', methods=['GET'])
def get_recipe_by_id(id):
    recipe = next((r for r in recipes if r["id"] == id), None)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify(recipe)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
        app.run(port=5555, debug=True)
