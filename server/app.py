from flask import request, jsonify, session
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from sqlalchemy import func
from config import app, db, bcrypt
from models import User, Recipe, Favorite

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

@app.route("/")
def home():
    return jsonify({"message": "Welcome to Recipe Finder!"})

@app.route("/user", methods=["GET"])
def get_current_user():
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401  
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
    }), 200

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username, email, password = data.get("username"), data.get("email"), data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already taken"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, email=email, password_hash=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return jsonify({"message": "Please log in via a POST request"}), 400

    data = request.json
    username, password = data.get("username"), data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        session["user_id"] = user.id  
        return jsonify({"message": "Login successful!", "user_id": user.id}), 200
    
    return jsonify({"message": "Invalid username or password"}), 401


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    session.pop("user_id", None)
    session.pop("_flashes", None)  
    return jsonify({"message": "Logged out successfully!"})

@app.route("/recipes", methods=["GET", "POST"])
def recipes():
    if request.method == "POST":
        data = request.get_json()
        if not all([data.get("title"), data.get("ingredients"), data.get("instructions")]):
            return jsonify({"message": "Missing required fields"}), 400

        new_recipe = Recipe(
            title=data["title"],
            ingredients=data["ingredients"],
            instructions=data["instructions"],
            image_url=data.get("image_url", ""),
            user_id=current_user.id if current_user.is_authenticated else None  
        )

        db.session.add(new_recipe)
        db.session.commit()

        return jsonify({
            "message": "Recipe added successfully!",
            "recipe": {
                "id": new_recipe.id,
                "title": new_recipe.title,
                "ingredients": new_recipe.ingredients,
                "instructions": new_recipe.instructions,
                "image_url": new_recipe.image_url,
                "user_id": new_recipe.user_id
            }
        }), 201

    elif request.method == "GET":
        try:
            recipes = Recipe.query.all()   
            return jsonify([
                {
                    "id": r.id,
                    "title": r.title,
                    "ingredients": r.ingredients,
                    "instructions": r.instructions,
                    "image_url": r.image_url
                }
                for r in recipes
            ]), 200
        except Exception as e:
            return jsonify({"error": "Database error", "details": str(e)}), 500



@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "")
    recipes = Recipe.query.filter(func.lower(Recipe.title).contains(query.lower())).all()
    return jsonify([{"id": r.id, "title": r.title} for r in recipes])

@app.route("/recipes/ingredients", methods=["GET"])
def search_by_ingredients():
    query = request.args.get("query", "")
    recipes = Recipe.query.filter(func.lower(Recipe.ingredients).contains(query.lower())).all()
    return jsonify([{"id": r.id, "title": r.title, "ingredients": r.ingredients} for r in recipes])

@app.route("/recipes/<int:recipe_id>", methods=["PATCH"])
@login_required
def update_recipe(recipe_id):
    data = request.json
    recipe = Recipe.query.get(recipe_id)

    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404

    if recipe.user_id != current_user.id:
        return jsonify({"message": "Unauthorized to update this recipe"}), 403

    recipe.title = data.get("title", recipe.title)
    recipe.ingredients = data.get("ingredients", recipe.ingredients)
    recipe.instructions = data.get("instructions", recipe.instructions)
    recipe.image_url = data.get("image_url", recipe.image_url)

    db.session.commit()

    return jsonify({
        "message": "Recipe updated successfully!",
        "recipe": {
            "id": recipe.id,
            "title": recipe.title,
            "ingredients": recipe.ingredients,
            "instructions": recipe.instructions,
            "image_url": recipe.image_url
        }
    }), 200

@app.route("/recipes/<int:recipe_id>", methods=["DELETE"])
@login_required
def delete_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)

    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404

    if recipe.user_id != current_user.id:
        return jsonify({"message": "Unauthorized to delete this recipe"}), 403

    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"message": "Recipe deleted successfully!"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5555)
