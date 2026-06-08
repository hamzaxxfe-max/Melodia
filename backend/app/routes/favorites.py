from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db import get_db
from ..models import Favorite, Song
from ..schemas.song_schema import SongResponse
from ..utils.auth import get_current_user
from ..models.user import User

router = APIRouter()

@router.get("/favorites", response_model=list[SongResponse])
async def list_favorites(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Song).join(Favorite, Song.id == Favorite.song_id).where(Favorite.user_id == user.id)
    )
    songs = result.scalars().all()
    return [SongResponse(id=s.id, title=s.title, artist=s.artist, album_id=s.album_id, album_title=s.album.title if s.album else None, duration=s.duration, track_number=s.track_number, audio_url=s.audio_url, image_url=s.image_url) for s in songs]

@router.post("/favorites/{song_id}")
async def add_favorite(song_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    exists = await db.execute(select(Favorite).where(Favorite.user_id == user.id, Favorite.song_id == song_id))
    if exists.scalar_one_or_none():
        return {"status": "already_favorited"}
    fav = Favorite(user_id=user.id, song_id=song_id)
    db.add(fav)
    await db.commit()
    return {"status": "added"}

@router.delete("/favorites/{song_id}")
async def remove_favorite(song_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Favorite).where(Favorite.user_id == user.id, Favorite.song_id == song_id))
    fav = result.scalar_one_or_none()
    if not fav:
        raise HTTPException(status_code=404, detail="Not favorited")
    await db.delete(fav)
    await db.commit()
    return {"status": "removed"}
