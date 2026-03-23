from DataBase.core import SessionLocal, init_db
from tables.users import User
from utils.security import hash_password

def seed_admin():
    # Make sure tables exist
    init_db()
    
    db = SessionLocal()
    try:
        admin_email = "admin123@gmail.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            print("Creating admin user...")
            hashed_pw = hash_password("admin@123")
            new_admin = User(
                name="Admin",
                email=admin_email,
                password=hashed_pw,
                phone="0000000000",
                role="admin",
                status="active",
                is_verified=True
            )
            db.add(new_admin)
            db.commit()
            print("Admin user created successfully.")
        elif not admin.is_verified:
            print("Admin user exists but is not verified. Verifying now...")
            admin.is_verified = True
            db.commit()
            print("Admin user verified successfully.")
        else:
            print("Admin user already exists and is verified.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
