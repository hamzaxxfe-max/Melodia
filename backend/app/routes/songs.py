from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import joinedload
from typing import Optional
from ..db import get_db
from ..models import Song, Album
from ..schemas.song_schema import SongResponse

router = APIRouter()

@router.get("/songs", response_model=list[SongResponse])
async def list_songs(
    q: Optional[str] = Query(None),
    limit: int = Query(50),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Song).options(joinedload(Song.album))
    if q:
        stmt = stmt.where(or_(Song.title.ilike(f"%{q}%"), Song.artist.ilike(f"%{q}%")))
    stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    songs = result.unique().scalars().all()
    return [
        SongResponse(
            id=s.id, title=s.title, artist=s.artist,
            album_id=s.album_id, album_title=s.album.title if s.album else None,
            duration=s.duration, track_number=s.track_number,
            audio_url=s.audio_url, image_url=s.image_url,
        )
        for s in songs
    ]

@router.get("/songs/{song_id}", response_model=SongResponse)
async def get_song(song_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Song).options(joinedload(Song.album)).where(Song.id == song_id))
    s = result.unique().scalar_one_or_none()
    if not s:
        raise HTTPException(status_code=404, detail="Song not found")
    return SongResponse(
        id=s.id, title=s.title, artist=s.artist,
        album_id=s.album_id, album_title=s.album.title if s.album else None,
        duration=s.duration, track_number=s.track_number,
        audio_url=s.audio_url, image_url=s.image_url,
    )
