from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from ..db import get_db
from ..models import Playlist, Song, playlist_songs
from ..schemas.playlist_schema import PlaylistCreate, PlaylistResponse, PlaylistDetail
from ..schemas.song_schema import SongResponse
from ..utils.auth import get_current_user
from ..models.user import User

router = APIRouter()

@router.post("/playlists", response_model=PlaylistResponse)
async def create_playlist(data: PlaylistCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    pl = Playlist(name=data.name, description=data.description, user_id=user.id)
    db.add(pl)
    await db.commit()
    await db.refresh(pl)
    return PlaylistResponse(id=pl.id, name=pl.name, description=pl.description, user_id=pl.user_id, song_count=0)

@router.get("/playlists", response_model=list[PlaylistResponse])
async def list_playlists(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Playlist).where(Playlist.user_id == user.id))
    pls = result.scalars().all()
    return [PlaylistResponse(id=p.id, name=p.name, description=p.description, user_id=p.user_id, song_count=len(p.songs)) for p in pls]

@router.get("/playlists/{pl_id}", response_model=PlaylistDetail)
async def get_playlist(pl_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Playlist).where(Playlist.id == pl_id, Playlist.user_id == user.id))
    pl = result.scalar_one_or_none()
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    songs = []
    for s in pl.songs:
        songs.append(SongResponse(id=s.id, title=s.title, artist=s.artist, album_id=s.album_id, album_title=s.album.title if s.album else None, duration=s.duration, track_number=s.track_number, audio_url=s.audio_url, image_url=s.image_url))
    return PlaylistDetail(id=pl.id, name=pl.name, description=pl.description, user_id=pl.user_id, song_count=len(songs), songs=songs)

@router.post("/playlists/{pl_id}/songs/{song_id}")
async def add_song_to_playlist(pl_id: int, song_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Playlist).where(Playlist.id == pl_id, Playlist.user_id == user.id))
    pl = result.scalar_one_or_none()
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    song_result = await db.execute(select(Song).where(Song.id == song_id))
    if not song_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Song not found")
    if song_id not in [s.id for s in pl.songs]:
        pl.songs.append(song_result.scalar_one())
        await db.commit()
    return {"status": "added"}

@router.delete("/playlists/{pl_id}/songs/{song_id}")
async def remove_song_from_playlist(pl_id: int, song_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Playlist).where(Playlist.id == pl_id, Playlist.user_id == user.id))
    pl = result.scalar_one_or_none()
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    pl.songs = [s for s in pl.songs if s.id != song_id]
    await db.commit()
    return {"status": "removed"}

@router.delete("/playlists/{pl_id}")
async def delete_playlist(pl_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Playlist).where(Playlist.id == pl_id, Playlist.user_id == user.id))
    pl = result.scalar_one_or_none()
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    await db.delete(pl)
    await db.commit()
    return {"status": "deleted"}
