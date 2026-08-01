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

    async with AsyncSessionLocal() as db:
        from app.config import settings

        super_name = settings.FIRST_SUPERUSER or "qwer1234"
        super_email = settings.FIRST_SUPERUSER_EMAIL or "admin@sentinel.local"
        super_pass = settings.FIRST_SUPERUSER_PASSWORD or "Admin@1234"

        # 1. Ensure primary Super Admin exists and is active
        res_super = await db.execute(select(User).where(User.username == super_name))
        super_admin = res_super.scalar_one_or_none()
        if not super_admin:
            super_admin = User(
                username=super_name,
                email=super_email,
                hashed_password=hash_password(super_pass),
                is_staff=True,
                is_active=True,
                role="admin",
            )
            db.add(super_admin)
            logger.info(f"✅ Super admin '{super_name}' created.")
        else:
            super_admin.is_active = True
            super_admin.is_staff = True
            super_admin.role = "admin"

        # Also ensure qwer1234 secondary super admin exists and is active
        res_qwer = await db.execute(select(User).where(User.username == "qwer1234"))
        qwer_admin = res_qwer.scalar_one_or_none()
        if not qwer_admin:
            qwer_admin = User(
                username="qwer1234",
                email="qwer1234@gmail.com",
                hashed_password=hash_password("qwer1234asdf1234"),
                is_staff=True,
                is_active=True,
                role="admin",
            )
            db.add(qwer_admin)
        else:
            qwer_admin.is_active = True
            qwer_admin.is_staff = True
            qwer_admin.role = "admin"

        # 2. Set all non-super-admin accounts in users table to is_active = False (Pending Super Admin approval)
        all_users = (await db.execute(select(User).where(User.username.notin_([super_name, "qwer1234"])))).scalars().all()
        for u in all_users:
            u.role = "admin"
            u.is_staff = True
            u.is_active = False  # Mandatory Super Admin approval required!

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
