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
    """Create/ensure the superuser accounts exist on startup."""
    from sqlalchemy import select, update as sa_update
    from app.database import AsyncSessionLocal
    from app.models.user_model import User
    from app.utils.password_handler import hash_password

    SUPER_ADMIN_ACCOUNTS = [
        {
            "username": "admin",
            "email": "admin@sentinel.local",
            "password": "Admin@1234",
        },
        {
            "username": "qwer1234",
            "email": "qwer1234@gmail.com",
            "password": "qwer1234asdf1234",
        },
    ]

    async with AsyncSessionLocal() as db:
        for account in SUPER_ADMIN_ACCOUNTS:
            res = await db.execute(select(User).where(User.username == account["username"]))
            existing = res.scalar_one_or_none()
            if not existing:
                user = User(
                    username=account["username"],
                    email=account["email"],
                    hashed_password=hash_password(account["password"]),
                    is_staff=True,
                    is_active=True,
                    role="admin",
                )
                db.add(user)
                logger.info(f"✅ Super admin '{account['username']}' created.")
            else:
                # Always ensure existing account has admin privileges
                if not existing.is_staff or existing.role != "admin":
                    await db.execute(
                        sa_update(User)
                        .where(User.username == account["username"])
                        .values(is_staff=True, role="admin", is_active=True)
                    )
                    logger.info(f"✅ Super admin '{account['username']}' promoted to admin.")
        await db.commit()


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
