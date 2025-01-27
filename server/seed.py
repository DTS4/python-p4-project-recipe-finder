# Standard library imports

# Remote library imports
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db
from models import Restaurant, Pizza, RestaurantPizza

# Seed data
def seed_data():
    with app.app_context():
        # Clear existing data
        RestaurantPizza.query.delete()
        Pizza.query.delete()
        Restaurant.query.delete()

        # Add restaurants
        restaurant1 = Restaurant(name="Pizza Palace", address="123 Main St")
        restaurant2 = Restaurant(name="Tasty Bites", address="456 Elm St")
        db.session.add_all([restaurant1, restaurant2])

        # Add pizzas
        pizza1 = Pizza(name="Pepperoni", ingredients="Pepperoni, Cheese, Tomato Sauce")
        pizza2 = Pizza(name="Margherita", ingredients="Cheese, Tomato, Basil")
        pizza3 = Pizza(name="BBQ Chicken", ingredients="Chicken, BBQ Sauce, Cheese")
        db.session.add_all([pizza1, pizza2, pizza3])

        # Add restaurant-pizza relationships (fix the relationship name)
        restaurant_pizza1 = RestaurantPizza(price=15, restaurant=restaurant1, pizza=pizza1)
        restaurant_pizza2 = RestaurantPizza(price=12, restaurant=restaurant1, pizza=pizza2)
        restaurant_pizza3 = RestaurantPizza(price=10, restaurant=restaurant2, pizza=pizza3)
        db.session.add_all([restaurant_pizza1, restaurant_pizza2, restaurant_pizza3])

        try:
            db.session.commit()
            print("Database seeded successfully!")
        except IntegrityError:
            db.session.rollback()
            print("Error: Failed to seed database due to integrity error.")

if __name__ == "__main__":
    seed_data()