from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
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
from utils.rate_limit import limiter


# ---------------------------------------------------------
# Lifespan (startup tasks)
# ---------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    yield


# ---------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------
app = FastAPI(
    title="BikeLo API",
    lifespan=lifespan,
    root_path="/bikelo_apis",
    docs_url="/docs",
    openapi_url="/openapi.json"
)


# ---------------------------------------------------------
# CORS (Frontend Access)
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Production frontend
        "https://www.bike-lo.com",
        "https://bike-lo.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# ---------------------------------------------------------
# Trusted Hosts (important behind Nginx)
# ---------------------------------------------------------
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)


# ---------------------------------------------------------
# Rate Limiting
# ---------------------------------------------------------
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ---------------------------------------------------------
# Routers
# ---------------------------------------------------------
app.include_router(auth_router)
app.include_router(bike_router)
app.include_router(sell_bike_router)
app.include_router(sell_listing_router)


# ---------------------------------------------------------
# Static files (uploaded images)
# ---------------------------------------------------------
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")


# ---------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "BikeLo API",
        "docs": "/bikelo_apis/docs"
    }


# ---------------------------------------------------------
# Run Server
# ---------------------------------------------------------
def main():
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


if __name__ == "__main__":
    main()