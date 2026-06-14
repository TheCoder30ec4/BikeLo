import logging

from config import settings
from DataBase.core import SessionLocal, init_db
from tables.users import User
from utils.security import hash_password

logger = logging.getLogger(__name__)


def seed_admin():
    init_db()

    if not settings.ADMIN_EMAIL or not settings.ADMIN_PASSWORD:
        logger.info("Skipping admin seed because ADMIN_EMAIL or ADMIN_PASSWORD is not set")
        return

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin:
            logger.info("Creating admin user for %s", settings.ADMIN_EMAIL)
            hashed_pw = hash_password(settings.ADMIN_PASSWORD)
            new_admin = User(
                name=settings.ADMIN_NAME,
                email=settings.ADMIN_EMAIL,
                password=hashed_pw,
                phone=settings.ADMIN_PHONE,
                role="admin",
                status="active",
                is_verified=True,
            )
            db.add(new_admin)
            db.commit()
            logger.info("Admin user created successfully")
        elif not admin.is_verified:
            logger.info("Admin user exists but is not verified. Verifying now")
            admin.is_verified = True
            db.commit()
            logger.info("Admin user verified successfully")
        else:
            logger.info("Admin user already exists and is verified")
    except Exception as e:
        db.rollback()
        logger.exception("Error seeding admin: %s", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
