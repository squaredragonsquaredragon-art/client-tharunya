"""
Simple rule-based + ML hybrid anomaly detector.
Uses Isolation Forest trained on login patterns.
Falls back to heuristic rules when no model exists.
"""
import os
import joblib
import numpy as np
from datetime import datetime, timezone
from app.utils.logger import get_logger

logger = get_logger(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

_model = None


def _load_model():
    global _model
    if _model is None and os.path.exists(MODEL_PATH):
        try:
            _model = joblib.load(MODEL_PATH)
            logger.info("ML model loaded from disk.")
        except Exception as e:
            logger.warning(f"Could not load model: {e}")
    return _model


def _hour_of_day(dt: datetime) -> int:
    return dt.hour


def _is_unusual_hour(hour: int) -> bool:
    """Flag logins between 1am – 5am local as unusual."""
    return 1 <= hour <= 5


def _ip_to_int(ip: str) -> int:
    try:
        parts = ip.split(".")
        if len(parts) == 4:
            return sum(int(p) << (8 * (3 - i)) for i, p in enumerate(parts))
    except Exception:
        pass
    return 0


def analyze_login(
    ip_address: str,
    country: str,
    browser: str,
    device: str,
    login_hour: int,
    recent_ips: list[str],
    recent_failed_count: int = 0,
    user_country: str = "",
) -> dict:
    """
    Returns: {
      is_suspicious: bool,
      risk_score: float (0-100),
      alert_type: str | None,
      description: str
    }
    """
    risk = 0.0
    alerts = []

    # --- Rule 1: Brute force (many recent failures) ---
    if recent_failed_count >= 5:
        risk += 40
        alerts.append("brute_force")

    # --- Rule 2: New IP address ---
    if ip_address not in recent_ips and recent_ips:
        risk += 15
        alerts.append("new_ip")

    # --- Rule 3: Geo anomaly (different country from usual) ---
    if user_country and country and country.lower() != user_country.lower():
        risk += 30
        alerts.append("geo_anomaly")

    # --- Rule 4: Unusual hour ---
    if _is_unusual_hour(login_hour):
        risk += 15
        alerts.append("unusual_time")

    # --- Rule 5: Known bad IP ranges (simplified) ---
    ip_int = _ip_to_int(ip_address)
    # Example: TOR exit node ranges (simplified heuristic)
    if ip_address.startswith(("185.220.", "194.165.", "45.142.")):
        risk += 25
        alerts.append("suspicious_ip")

    # --- ML model boost ---
    model = _load_model()
    if model is not None:
        try:
            features = np.array([[
                _ip_to_int(ip_address),
                login_hour,
                recent_failed_count,
                len(recent_ips),
                1 if _is_unusual_hour(login_hour) else 0,
            ]])
            pred = model.predict(features)
            if pred[0] == -1:  # Isolation Forest anomaly = -1
                risk += 20
                alerts.append("ml_anomaly")
        except Exception as e:
            logger.debug(f"ML inference error: {e}")

    risk = min(risk, 100.0)
    is_suspicious = risk >= 30

    primary_alert = alerts[0] if alerts else None

    descriptions = {
        "brute_force": f"Multiple failed login attempts detected from {ip_address}",
        "geo_anomaly": f"Login from unexpected country: {country}",
        "unusual_time": f"Login at unusual hour ({login_hour}:00)",
        "new_ip": f"First time login from IP {ip_address}",
        "suspicious_ip": f"Login from flagged IP range: {ip_address}",
        "ml_anomaly": f"AI anomaly detection flagged this login as suspicious",
    }

    description = descriptions.get(primary_alert, "Unusual login activity detected")

    return {
        "is_suspicious": is_suspicious,
        "risk_score": round(risk, 2),
        "alert_type": primary_alert,
        "description": description,
        "all_flags": alerts,
    }
