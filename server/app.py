from flask import Flask, request, jsonify, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from sqlalchemy import func
from config import app, db, bcrypt
from models import db, Recipe

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Import models after initializing db
from models import User, Recipe, Favorite

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Recipe Finder!"})

# User Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        session['user_id'] = user.id  # Store user ID in session
        return jsonify({"message": "Login successful!", "user_id": user.id}), 200
    return jsonify({"message": "Invalid username or password"}), 401

# Logout Route
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    session.pop('user_id', None)  # Remove user ID from session
    return jsonify({"message": "Logged out successfully!"})

# Dashboard Route
@app.route('/dashboard')
@login_required
def dashboard():
    page = request.args.get('page', 1, type=int)
    recipes = Recipe.query.filter_by(user_id=current_user.id).paginate(page, 5, False)
    return jsonify({
        "recipes": [recipe.title for recipe in recipes.items],
        "pagination": {
            "current_page": recipes.page,
            "total_pages": recipes.pages
        }
    })

# Recipe Detail Route
@app.route('/recipes/<int:recipe_id>', methods=['GET'])
@login_required
def recipe_detail(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify({
        "id": recipe.id,
        "title": recipe.title,
        "description": recipe.description,
        "image_url": recipe.image_url
    })

# Add Recipe Route
@app.route('/add_recipe', methods=['POST'])
@login_required
def add_recipe():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    image_url = data.get('image_url')

    new_recipe = Recipe(title=title, description=description, image_url=image_url, user_id=current_user.id)
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify({"message": "Recipe added successfully!"}), 201

# List All Recipes Route
@app.route('/recipes', methods=['GET'])
def get_recipes():
    try:
        recipes = Recipe.query.all()
        recipes_data = [
            {
                "id": recipe.id,
                "title": recipe.title,
                "description": recipe.description,
                "image_url": recipe.image_url,
                "user_id": recipe.user_id
            }
            for recipe in recipes
        ]
        return jsonify(recipes_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recipes', methods=['POST'])
def create_recipe():  
    data = request.get_json()
    new_recipe = Recipe(
        title=data["title"],
        ingredients=data["ingredients"],
        instructions=data["instructions"],
        image_url=data["image_url"],
    )
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify({"message": "Recipe added successfully!", "recipe": data}), 201

# Password Reset Route
@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    user = User.query.filter_by(email=email).first()

    if user:
        new_password = data.get('new_password')
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password_hash = hashed_password
        db.session.commit()
        return jsonify({"message": "Password reset successfully!"})
    
    return jsonify({"message": "Email not found"}), 404

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    recipes = Recipe.query.filter(func.lower(Recipe.title).contains(query.lower())).all()
    return jsonify([{ "id": recipe.id, "title": recipe.title } for recipe in recipes])

if __name__ == '__main__':
    app.run(debug=True, port=5555)
