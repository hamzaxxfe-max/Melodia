import os
import warnings

SECRET_KEY: str = os.getenv("MELODIA_SECRET_KEY", "melodia-dev-secret-change-in-production")
if SECRET_KEY in ("melodia-super-secret-key-change-in-production-2024", "melodia-dev-secret-change-in-production"):
    warnings.warn("MELODIA_SECRET_KEY is using default/weak value. Set MELODIA_SECRET_KEY env var in production.")

ALGORITHM: str = os.getenv("MELODIA_JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("MELODIA_TOKEN_EXPIRE_MINUTES", "1440"))
DATABASE_URL: str = os.getenv("MELODIA_DATABASE_URL", "sqlite+aiosqlite:///./melodia.db")
CORS_ORIGINS: list[str] = os.getenv("MELODIA_CORS_ORIGINS", "http://localhost:5173,http://localhost:4173").split(",")
