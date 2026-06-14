from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
import os
import psycopg2
from dotenv import load_dotenv

from config import settings

load_dotenv()


def _first_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    return ""


def _build_database_url() -> str:
    if settings.DATABASE_URL:
        return settings.DATABASE_URL

    user = _first_env("DB_USER", "POSTGRES_USER", "user")
    password = _first_env("DB_PASSWORD", "POSTGRES_PASSWORD", "password")
    host = _first_env("DB_HOST", "POSTGRES_HOST", "host")
    port = _first_env("DB_PORT", "POSTGRES_PORT", "port")
    dbname = _first_env("DB_NAME", "POSTGRES_DB", "dbname")

    if all((user, password, host, port, dbname)):
        return f"postgresql://{user}:{password}@{host}:{port}/{dbname}"

    raise RuntimeError("DATABASE_URL or standard database env vars must be set")


DATABASE_URL = _build_database_url()

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db() -> None:
    """
    Import all table modules and create tables in the configured database.

    Call this once on startup (see FastAPI app lifespan in main.py).
    """

    # Import models so they are registered with SQLAlchemy's metadata
    from tables import bikes, refresh_tokens, sell_bikes, sell_listings, users, spare_parts  # noqa: F401

    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def get_psycopg2_connection():
    """Return a raw psycopg2 connection. Caller must close it."""
    if DATABASE_URL:
        return psycopg2.connect(DATABASE_URL)
    raise ValueError("DATABASE_URL or standard database env vars must be set")


def test_connection():
    """Connect to the database, run SELECT NOW(), print result, and close."""
    try:
        connection = get_psycopg2_connection()
        print("Connection successful!")
        cursor = connection.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        print("Current Time:", result)
        cursor.close()
        connection.close()
        print("Connection closed.")
    except Exception as e:
        print(f"Failed to connect: {e}")
