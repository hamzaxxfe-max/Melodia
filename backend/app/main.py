import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from .config import CORS_ORIGINS
from .db import init_db, async_session
from .utils.seed import seed_database
from .routes import auth, songs, albums, playlists, favorites

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("melodia")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    async with async_session() as db:
        await seed_database(db)
    yield

app = FastAPI(title="Melodia API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(songs.router, prefix="/api", tags=["songs"])
app.include_router(albums.router, prefix="/api", tags=["albums"])
app.include_router(playlists.router, prefix="/api", tags=["playlists"])
app.include_router(favorites.router, prefix="/api", tags=["favorites"])

@app.get("/api/health")
async def health():
    try:
        async with async_session() as db:
            await db.execute(select(1))
            return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}
