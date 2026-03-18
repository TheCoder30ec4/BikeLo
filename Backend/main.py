from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from config import settings
from DataBase.core import init_db
from controllers.auth_controller import router as auth_router
from controllers.bike_controller import router as bike_router
from controllers.sell_bike_controller import router as sell_bike_router
from controllers.sell_listing_controller import router as sell_listing_router
from controllers.user_data_controller import router as user_data_router
from utils.rate_limit import limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(title="BikeLo API", lifespan=lifespan)

# CORS: allow frontend (Vite default dev origin) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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

# Serve uploaded bike images at /static/bikes/... (ensure dir exists before mount)
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")


@app.get("/")
def root():
    return {"message": "BikeLo API", "docs": "/docs"}


def main():
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)


if __name__ == "__main__":
    main()
