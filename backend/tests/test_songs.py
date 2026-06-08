import pytest
from sqlalchemy import select
from app.models import Song, Album

@pytest.mark.asyncio
async def test_list_songs_empty(client):
    r = await client.get("/api/songs")
    assert r.status_code == 200
    assert r.json() == []

@pytest.mark.asyncio
async def test_create_song_and_list(client, db_session):
    album = Album(title="Test Album", artist="Test Artist")
    db_session.add(album)
    await db_session.commit()
    await db_session.refresh(album)

    song = Song(title="Test Song", artist="Test Artist", album_id=album.id, duration=200, track_number=1)
    db_session.add(song)
    await db_session.commit()

    r = await client.get("/api/songs")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Song"

@pytest.mark.asyncio
async def test_search_songs(client, db_session):
    album = Album(title="Search Album", artist="Search Artist")
    db_session.add(album)
    await db_session.commit()

    db_session.add(Song(title="Unique Title", artist="John", album_id=album.id, duration=100, track_number=1))
    db_session.add(Song(title="Another Track", artist="Jane", album_id=album.id, duration=150, track_number=2))
    await db_session.commit()

    r = await client.get("/api/songs?q=Unique")
    assert r.status_code == 200
    assert len(r.json()) == 1

    r2 = await client.get("/api/songs?q=Jane")
    assert r2.status_code == 200
    assert len(r2.json()) == 1
