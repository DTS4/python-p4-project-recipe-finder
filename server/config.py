import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for the app (with support for credentials and specific origin)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///recipes.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mysecretkey')

# Initialize SQLAlchemy with Flask app
db = SQLAlchemy(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize Bcrypt
bcrypt = Bcrypt(app)

# Initialize Flask-RESTful API
api = Api(app)

# Ensuring the app runs in context and creates tables
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True, port=5555)

