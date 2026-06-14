import logging
from contextlib import asynccontextmanager
from pathlib import Path


def _configure_logging() -> None:
    """Configure application logging after the server initialises handlers."""
    fmt = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    root = logging.getLogger()
    log_level = getattr(logging, settings.LOG_LEVEL, logging.INFO)
    root.setLevel(log_level)
    if not root.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(fmt))
        root.addHandler(handler)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from config import settings, validate_runtime_settings
from controllers.auth_controller import router as auth_router
from controllers.bike_controller import router as bike_router
from controllers.sell_bike_controller import router as sell_bike_router
from controllers.sell_listing_controller import router as sell_listing_router
from controllers.user_controller import router as user_router
from controllers.lead_controller import router as lead_router
from controllers.spare_part_controller import router as spare_part_router
from DataBase.core import init_db
from utils.rate_limit import limiter

_configure_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _configure_logging()
    validate_runtime_settings()
    init_db()
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    (Path(settings.UPLOAD_DIR) / "bikes").mkdir(parents=True, exist_ok=True)
    (Path(settings.UPLOAD_DIR) / "spare_parts").mkdir(parents=True, exist_ok=True)
    (Path(settings.UPLOAD_DIR) / "sell_bikes").mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(title="BikeLo API", lifespan=lifespan)

# CORS: allow frontend (Vite default dev origin) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://www.bike-lo.com",
        "https://bike-lo-izsi.vercel.app",
    ],
    allow_origin_regex=r"https://bike-lo-izsi.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting (login/signup: 5/minute per IP)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Auth routes: /auth/signup, /auth/login, /auth/refresh, /auth/me
app.include_router(auth_router)
# Bike routes (admin-only create): /bikes
app.include_router(bike_router)
# Sell-bike form (authenticated user): /sell-bikes
app.include_router(sell_bike_router)
# Simple sell listing: /sell-listings
app.include_router(sell_listing_router)
# User Data (admin & self)
app.include_router(user_router)
# Lead routes
app.include_router(lead_router)
# Spare Part routes
app.include_router(spare_part_router)

# Serve uploaded images (ensure dirs exist)
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
(Path(settings.UPLOAD_DIR) / "bikes").mkdir(parents=True, exist_ok=True)
(Path(settings.UPLOAD_DIR) / "spare_parts").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")


@app.get("/")
def root():
    return {"message": "BikeLo API", "docs": "/docs"}


def main():
    import uvicorn

    import os

    is_development = os.getenv("DEPLOYMENT", "False").lower() not in ("true", "1", "yes")
    uvicorn.run("main:app", host="0.0.0.0", port=settings.APP_PORT, reload=is_development)


if __name__ == "__main__":
    main()
