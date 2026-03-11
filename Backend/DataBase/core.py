from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Fetch env vars for direct psycopg2 and for building DATABASE_URL
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Use DATABASE_URL if set, otherwise build from components
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL and all((USER, PASSWORD, HOST, PORT, DBNAME)):
    DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db() -> None:
    """
    Import all table modules and create tables in the configured database.

    Call this once on startup (see FastAPI app lifespan in main.py).
    """

    # Import models so they are registered with SQLAlchemy's metadata
    from tables import bikes, refresh_tokens, sell_bikes, sell_listings, users  # noqa: F401

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
    if all((USER, PASSWORD, HOST, PORT, DBNAME)):
        return psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME,
        )
    if DATABASE_URL:
        return psycopg2.connect(DATABASE_URL)
    raise ValueError("Set DATABASE_URL or (user, password, host, port, dbname) in .env")


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