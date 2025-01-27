#!/usr/bin/env python3
from functools import wraps
from flask import Flask, jsonify, request, session
from flask_restful import Api
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session
from config import app, db, api
from models import User, Recipe, Favorite, Restaurant, Pizza, RestaurantPizza
from sqlalchemy import or_

import os

# Configure database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.secret_key = os.environ.get("SECRET_KEY", "supersecretkey")   
Session(app)

db.init_app(app)

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# --- Signup Route ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = generate_password_hash(data["password"], method="sha256")

    try:
        new_user = User(
            username=data["username"],
            password_hash=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully", "user": new_user.to_dict()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username already exists"}), 400

# --- Login Route ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if user and check_password_hash(user.password_hash, data["password"]):
        session["user_id"] = user.id
        return jsonify({"message": "Login successful", "user": user.to_dict()}), 200
    return jsonify({"error": "Invalid username or password"}), 401

# --- Logout Route ---
@app.route('/logout', methods=['POST'])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logout successful"}), 200

@app.route('/profile', methods=['GET'])
def profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200

# --- Recipe Routes ---
def login_required(f):
    """Decorator to require login for specific routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/recipes', methods=['GET'])
def get_recipes():
    # Pagination, filtering, and search functionality
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')

    query = Recipe.query
    if search:
        query = query.filter(or_(Recipe.description.ilike(f"%{search}%"), Recipe.image_url.ilike(f"%{search}%")))

    recipes = query.paginate(page, per_page, False)
    return jsonify([recipe.to_dict() for recipe in recipes.items])

@app.route('/recipes/<int:id>', methods=['GET'])
def get_recipe_by_id(id):
    recipe = Recipe.query.get(id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify(recipe.to_dict())

@app.route('/recipes', methods=['POST'])
@login_required
def create_recipe():
    data = request.get_json()
    try:
        new_recipe = Recipe(
            description=data['description'],
            image_url=data.get('image_url'),
            user_id=session['user_id']  # Use the user_id from the session
        )
        db.session.add(new_recipe)
        db.session.commit()
        return jsonify(new_recipe.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Invalid data or foreign key constraint violation"}), 400

# --- Favorite Routes ---
@app.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = Favorite.query.all()
    return jsonify([favorite.to_dict() for favorite in favorites])

@app.route('/favorites', methods=['POST'])
def create_favorite():
    data = request.get_json()
    try:
        new_favorite = Favorite(
            user_id=data['user_id'],
            recipe_id=data['recipe_id'],
            notes=data.get('notes')
        )
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify(new_favorite.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Invalid data or foreign key constraint violation"}), 400

@app.route('/favorites/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    favorite = Favorite.query.get(id)
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return '', 204

# --- Other Routes ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(port=5555, debug=True)