from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from flask_login import UserMixin
from flask_cors import CORS  # Import CORS
from config import db, app

# Initialize CORS here
CORS(app)  # This allows frontend requests to access the backend

class User(UserMixin, db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    recipes = db.relationship("Recipe", back_populates="user", lazy="dynamic")
    favorites = db.relationship("Favorite", back_populates="user", lazy=True)

    serialize_only = ("id", "username", "email")

    @validates("email")
    def validate_email(self, key, value):
        if "@" not in value or "." not in value:
            raise ValueError("Invalid email address")
        return value

class Recipe(db.Model, SerializerMixin):
    __tablename__ = "recipes"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String(500), nullable=True)
    ingredients = db.Column(db.String(1000), nullable=True)
    instructions = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="recipes")
    favorites = db.relationship("Favorite", back_populates="recipe", lazy=True)

    serialize_only = ("id", "title", "ingredients", "instructions", "image_url", "user_id")

class Favorite(db.Model):
    __tablename__ = "favorites"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)

    user = db.relationship("User", back_populates="favorites")
    recipe = db.relationship("Recipe", back_populates="favorites")
