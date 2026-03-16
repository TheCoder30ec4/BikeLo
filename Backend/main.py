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


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title="BikeLo API",
    lifespan=lifespan,
    root_path="/bikelo_apis",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted hosts (important when behind Nginx)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# Rate limiting
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Routers
app.include_router(auth_router)
app.include_router(bike_router)
app.include_router(sell_bike_router)
app.include_router(sell_listing_router)

# Static files for uploaded images
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")


@app.get("/")
def root():
    return {
        "message": "BikeLo API",
        "docs": "/bikelo_apis/docs"
    }


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