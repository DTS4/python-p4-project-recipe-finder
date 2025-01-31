# Recipe Finder

Recipe Finder is a web application that allows users to browse, add, edit, and delete recipes. The app has a user-friendly interface where users can find recipes based on ingredients and instructions, view images, and save their favorite recipes.

## Features

- **View Recipes**: All users, whether logged in or not, can view the list of recipes.
- **Add Recipes**: Authenticated users can add new recipes with ingredients, instructions, and an optional image URL.
- **Edit Recipes**: Authenticated users can edit their own recipes.
- **Delete Recipes**: Authenticated users can delete their own recipes.
- **Recipe Details**: Each recipe shows the title, ingredients, instructions, and an optional image.

## Technologies Used

- **Frontend**:
    - React.js
    - React Router for navigation
    - Axios for API calls
- **Backend**:
    - Flask (Python)
    - SQLAlchemy for database interaction
    - Flask-Login for user authentication (optional, for user-specific features)
- **Database**: SQLite (for local development, can be changed for production)

## Installation

### Prerequisites

- Python 3.x
- Node.js and npm (for frontend development)
- SQLite (or any other preferred database)

### Backend Setup

1. Clone the repository:
   ```Bash
   git clone [https://github.com/your-username/recipe-finder.git](https://github.com/your-username/recipe-finder.git)
   cd recipe-finder

2. Create and activate a virtual environment:
   ```Bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate

3. Install the required Python packages:
   ```Bash 
   pip install -r requirements.txt

4. Set up the database:
   ''' Bash
   flask db init
   flask db migrate
   flask db upgrade

5. Run the backend server:
   ``` Bash
   flask run

## Frontend Setup

1. Navigate to the frontend directory:
   ``` Bash
   cd frontend

2. Install the necessary npm packages:
   ``` Bash
   npm install

3. Start the React development server:
   ``` Bash
   npm start

- The frontend will be running at http://localhost:3000, and the backend at http://localhost:5000.

## API Endpoints

   `` GET /recipes

* Fetch all recipes (available to both logged-in and non-logged-in users).

### Response:
* Returns a list of recipes.

   ``POST /recipes

- Add a new recipe (only for authenticated users).

## Authentication:
Users can sign up and log in to add, edit, and delete their recipes. Authentication is handled by Flask-Login (for user-specific features).

## Contributing 
Feel free to fork the repository and submit pull requests. If you encounter any bugs or have any suggestions for improvements, please open an issue in the GitHub repository.

## License 
This project is licensed under the MIT License - see the LICENSE file for details.

# Acknowledgements

* Thanks to React.js and Flask for providing the tools to build this project.
* Inspiration from various recipe finder apps and APIs.
 