from app import app, db
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
            image_url='https://www.sipandfeast.com/wp-content/uploads/2022/09/spaghetti-carbonara-recipe-snippet.jpg',
            user_id=user1.id
        )
        recipe2 = Recipe(
            title='Chocolate Cake',
            description='Rich and moist chocolate cake with creamy chocolate frosting.',
            image_url='https://res.cloudinary.com/dulnfomcr/image/upload/v1738256494/download_3_s8giqq.jpg',
            user_id=user3.id
        )
        recipe3 = Recipe(
            title='Avocado Toast',
            description='Healthy and delicious avocado toast with a sprinkle of chili flakes.',
            image_url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc9AIvAc6dkD5GTVhVASi91F4Jc4n7AbOFhw&s',
            user_id=user2.id
        )
        recipe4 = Recipe(
            title='Grilled Cheese Sandwich',
            description='A crispy, buttery sandwich filled with melted cheese.',
            image_url='https://natashaskitchen.com/wp-content/uploads/2021/08/Grilled-Cheese-Sandwich-SQ.jpg',
            user_id=user1.id
        )
        recipe5 = Recipe(
            title='Tacos',
            description='Soft tortillas filled with spiced meat, vegetables, and salsa.',
            image_url='https://www.allrecipes.com/thmb/qWvc3DAtgp4sVE40nPKQiTW0OoI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/70935-taqueria-style-tacos-mfs-1x2-40-691efd4df7f14cdd8280ca9d7a62692e.jpg',
            user_id=user2.id
        )
        recipe6 = Recipe(
            title='Caesar Salad',
            description='A fresh salad with crunchy croutons, parmesan, and creamy Caesar dressing.',
            image_url='https://www.grocery.coop/sites/default/files/NCG_Dennis_Becker_Classic_Caesar_Salad_715_x_477.jpg',
            user_id=user3.id
        )

        db.session.add_all([recipe1, recipe2, recipe3, recipe4, recipe5, recipe6])
        db.session.commit()

        # Create favorites
        favorite1 = Favorite(user_id=user1.id, recipe_id=recipe2.id)
        favorite2 = Favorite(user_id=user2.id, recipe_id=recipe1.id)
        favorite3 = Favorite(user_id=user3.id, recipe_id=recipe3.id)

        db.session.add_all([favorite1, favorite2, favorite3])
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
