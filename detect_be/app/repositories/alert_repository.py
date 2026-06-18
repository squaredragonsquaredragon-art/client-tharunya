from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.suspicious_log_model import SuspiciousLog
from app.models.otp_alert_model import OtpAlert
from datetime import datetime, timezone


class AlertRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_suspicious(self, log: SuspiciousLog) -> SuspiciousLog:
        self.db.add(log)
        await self.db.flush()
        await self.db.refresh(log)
        return log

    def _user_cond(self, user_id: str | list[str]):
        if isinstance(user_id, list):
            return SuspiciousLog.user_id.in_(user_id)
        return SuspiciousLog.user_id == user_id

    async def get_alerts_by_user(
        self, user_id: str | list[str], skip: int = 0, limit: int = 20
    ) -> tuple[int, int, list[SuspiciousLog]]:
        cond = self._user_cond(user_id)
        count_q = await self.db.execute(
            select(func.count()).where(cond)
        )
        total = count_q.scalar_one()
        unread_q = await self.db.execute(
            select(func.count()).where(
                cond, SuspiciousLog.is_read == False
            )
        )
        unread = unread_q.scalar_one()
        result = await self.db.execute(
            select(SuspiciousLog)
            .where(cond)
            .order_by(desc(SuspiciousLog.created_at))
            .offset(skip)
            .limit(limit)
        )
        return total, unread, list(result.scalars().all())

    async def get_all_alerts_paginated(
        self, skip: int = 0, limit: int = 20
    ) -> tuple[int, int, list[SuspiciousLog]]:
        count_q = await self.db.execute(
            select(func.count(SuspiciousLog.id))
        )
        total = count_q.scalar_one()
        unread_q = await self.db.execute(
            select(func.count(SuspiciousLog.id)).where(
                SuspiciousLog.is_read == False
            )
        )
        unread = unread_q.scalar_one()
        result = await self.db.execute(
            select(SuspiciousLog)
            .order_by(desc(SuspiciousLog.created_at))
            .offset(skip)
            .limit(limit)
        )
        return total, unread, list(result.scalars().all())

    async def get_all_unread_count(self) -> int:
        result = await self.db.execute(
            select(func.count(SuspiciousLog.id)).where(
                SuspiciousLog.is_read == False
            )
        )
        return result.scalar_one()

    async def mark_read(self, alert_id: str, user_id: str | list[str]) -> bool:
        cond = self._user_cond(user_id)
        result = await self.db.execute(
            select(SuspiciousLog).where(
                SuspiciousLog.id == alert_id, cond
            )
        )
        alert = result.scalar_one_or_none()
        if alert:
            alert.is_read = True
            await self.db.flush()
            return True
        return False

    async def mark_all_read(self, user_id: str | list[str]) -> None:
        cond = self._user_cond(user_id)
        result = await self.db.execute(
            select(SuspiciousLog).where(
                cond, SuspiciousLog.is_read == False
            )
        )
        for alert in result.scalars().all():
            alert.is_read = True
        await self.db.flush()

    async def get_unread_count(self, user_id: str | list[str]) -> int:
        cond = self._user_cond(user_id)
        result = await self.db.execute(
            select(func.count()).where(
                cond, SuspiciousLog.is_read == False
            )
        )
        return result.scalar_one()

    # OTP
    async def create_otp(self, otp: OtpAlert) -> OtpAlert:
        self.db.add(otp)
        await self.db.flush()
        await self.db.refresh(otp)
        return otp

    async def get_latest_otp(self, user_id: str) -> OtpAlert | None:
        result = await self.db.execute(
            select(OtpAlert)
            .where(OtpAlert.user_id == user_id, OtpAlert.is_verified == False)
            .order_by(desc(OtpAlert.created_at))
            .limit(1)
        )
        return result.scalar_one_or_none()
