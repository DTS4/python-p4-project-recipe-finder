from app import app, db  # Ensure these are correctly imported from your Flask app
from models import User, Recipe, Favorite
from werkzeug.security import generate_password_hash

def seed_data():
    with app.app_context():
        # Clear existing data
        db.session.query(Favorite).delete()
        db.session.query(Recipe).delete()
        db.session.query(User).delete()
        db.session.commit()

        # Create users
        user1 = User(username='chef_anna', email='anna@example.com', password_hash=generate_password_hash('password1'))
        user2 = User(username='foodie_john', email='john@example.com', password_hash=generate_password_hash('password2'))
        user3 = User(username='baker_emily', email='emily@example.com', password_hash=generate_password_hash('password3'))

        db.session.add_all([user1, user2, user3])
        db.session.commit()

        # Create recipes
        recipe1 = Recipe(
            title='Spaghetti Carbonara',
            description='A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.',
            image_url='https://example.com/spaghetti.jpg',
            user_id=user1.id
        )
        recipe2 = Recipe(
            title='Chocolate Cake',
            description='Rich and moist chocolate cake with creamy chocolate frosting.',
            image_url='https://example.com/chocolate_cake.jpg',
            user_id=user3.id
        )
        recipe3 = Recipe(
            title='Avocado Toast',
            description='Healthy and delicious avocado toast with a sprinkle of chili flakes.',
            image_url='https://example.com/avocado_toast.jpg',
            user_id=user2.id
        )

        db.session.add_all([recipe1, recipe2, recipe3])
        db.session.commit()

        # Create favorites
        favorite1 = Favorite(user_id=user1.id, recipe_id=recipe2.id)  # Anna likes Emily's Chocolate Cake
        favorite2 = Favorite(user_id=user2.id, recipe_id=recipe1.id)  # John likes Anna's Spaghetti Carbonara
        favorite3 = Favorite(user_id=user3.id, recipe_id=recipe3.id)  # Emily likes John's Avocado Toast

        db.session.add_all([favorite1, favorite2, favorite3])
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
