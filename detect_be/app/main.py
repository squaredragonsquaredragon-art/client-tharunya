from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.utils.logger import get_logger
from app.routers import auth_router, login_router, alert_router, user_router, admin_router

# Import all models so SQLAlchemy sees them before create_all
from app.models import user_model, login_log_model, suspicious_log_model, otp_alert_model, app_users  # noqa

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting SentinelAI backend...")
    await init_db()
    await _seed_admin()
    logger.info("✅ Database ready.")
    yield
    logger.info("🛑 Shutting down...")


async def _seed_admin():
    """Create the first superuser if no users exist."""
    from app.database import AsyncSessionLocal
    from app.repositories.user_repository import UserRepository
    from app.models.user_model import User
    from app.utils.password_handler import hash_password

    async with AsyncSessionLocal() as db:
        repo = UserRepository(db)
        if not await repo.exists_username(settings.FIRST_SUPERUSER):
            user = User(
                username=settings.FIRST_SUPERUSER,
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=hash_password(settings.FIRST_SUPERUSER_PASSWORD),
                is_staff=True,
                role="admin",
            )
            db.add(user)
            await db.commit()
            logger.info(f"✅ Admin user '{settings.FIRST_SUPERUSER}' created.")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered login anomaly detection and security monitoring API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ─── CORS ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ────────────────────────────────────────────────
API_PREFIX = "/api"
app.include_router(auth_router.router, prefix=API_PREFIX)
app.include_router(user_router.router, prefix=API_PREFIX)
app.include_router(login_router.router, prefix=API_PREFIX)
app.include_router(alert_router.router, prefix=API_PREFIX)
app.include_router(admin_router.router, prefix=API_PREFIX)


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "ok", "app": settings.APP_NAME, "version": "1.0.0"}
