from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from ..db import get_db
from ..models import Album, Song
from ..schemas.album_schema import AlbumResponse, AlbumDetail
from ..schemas.song_schema import SongResponse

router = APIRouter()

@router.get("/albums", response_model=list[AlbumResponse])
async def list_albums(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Album).options(joinedload(Album.songs)).order_by(Album.release_year.desc()))
    albums = result.unique().scalars().all()
    return [
        AlbumResponse(id=a.id, title=a.title, artist=a.artist, image_url=a.image_url, release_year=a.release_year, song_count=len(a.songs))
        for a in albums
    ]

@router.get("/albums/{album_id}", response_model=AlbumDetail)
async def get_album(album_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Album).options(joinedload(Album.songs)).where(Album.id == album_id))
    a = result.unique().scalar_one_or_none()
    if not a:
        raise HTTPException(status_code=404, detail="Album not found")
    songs = [
        SongResponse(id=s.id, title=s.title, artist=s.artist, album_id=s.album_id, album_title=a.title, duration=s.duration, track_number=s.track_number, audio_url=s.audio_url, image_url=s.image_url)
        for s in a.songs
    ]
    return AlbumDetail(id=a.id, title=a.title, artist=a.artist, image_url=a.image_url, release_year=a.release_year, song_count=len(a.songs), songs=songs)
