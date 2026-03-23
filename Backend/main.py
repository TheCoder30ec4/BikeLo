import logging
from contextlib import asynccontextmanager
from pathlib import Path


def _configure_logging() -> None:
    """Force DEBUG on the root logger and the lead controller.
    Must be called AFTER uvicorn/gunicorn set up their handlers,
    otherwise basicConfig is a no-op."""
    fmt = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    root = logging.getLogger()
    root.setLevel(logging.DEBUG)
    # Add a console handler only if there isn't one already
    if not root.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(fmt))
        root.addHandler(handler)
    # Specifically set the lead_controller logger to DEBUG
    logging.getLogger("controllers.lead_controller").setLevel(logging.DEBUG)


_configure_logging()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from config import settings
from DataBase.core import init_db
from seed_admin import seed_admin
from controllers.auth_controller import router as auth_router
from controllers.bike_controller import router as bike_router
from controllers.sell_bike_controller import router as sell_bike_router
from controllers.sell_listing_controller import router as sell_listing_router
from controllers.user_data_controller import router as user_data_router
from controllers.lead_controller import router as lead_router
from utils.rate_limit import limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Re-apply log level after uvicorn has initialised its own handlers
    _configure_logging()
    init_db()
    seed_admin()
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
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
        "http://localhost:5173/"
    ],
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
# User Data (admin)
app.include_router(user_data_router)
# Lead routes
app.include_router(lead_router)

# Serve uploaded bike images at /static/bikes/... (ensure dir exists before mount)
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")


@app.get("/")
def root():
    return {"message": "BikeLo API", "docs": "/docs"}


def main():
    import uvicorn
    import os
    from config import settings
    # if DEPLOYMENT is False, use reload, otherwise no
    is_development = os.getenv("DEPLOYMENT", "False").lower() not in ("true", "1", "yes")
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=is_development)


if __name__ == "__main__":
    main()
