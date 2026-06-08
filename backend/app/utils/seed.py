from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Album, Song, User
from .auth import hash_password

def _seed_data():
    albums = [
        Album(id=1, title="Neon Nights", artist="Luna Eclipse", image_url="", release_year=2024),
        Album(id=2, title="Electric Dreams", artist="The Vectors", image_url="", release_year=2023),
        Album(id=3, title="Ocean Wave", artist="Coral Reefs", image_url="", release_year=2024),
        Album(id=4, title="Midnight Jazz", artist="Blue Note Ensemble", image_url="", release_year=2022),
    ]
    songs = [
        Song(title="Neon Lights", artist="Luna Eclipse", album_id=1, duration=214, track_number=1, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", image_url=""),
        Song(title="Starlight", artist="Luna Eclipse", album_id=1, duration=187, track_number=2, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", image_url=""),
        Song(title="Midnight Run", artist="Luna Eclipse", album_id=1, duration=203, track_number=3, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", image_url=""),
        Song(title="Eclipse", artist="Luna Eclipse", album_id=1, duration=256, track_number=4, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", image_url=""),
        Song(title="Pulse", artist="The Vectors", album_id=2, duration=198, track_number=1, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", image_url=""),
        Song(title="Digital Love", artist="The Vectors", album_id=2, duration=225, track_number=2, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", image_url=""),
        Song(title="Circuit Breaker", artist="The Vectors", album_id=2, duration=178, track_number=3, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", image_url=""),
        Song(title="Waveform", artist="The Vectors", album_id=2, duration=242, track_number=4, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", image_url=""),
        Song(title="Coral Blue", artist="Coral Reefs", album_id=3, duration=195, track_number=1, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", image_url=""),
        Song(title="Deep Dive", artist="Coral Reefs", album_id=3, duration=267, track_number=2, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", image_url=""),
        Song(title="Surface Tension", artist="Coral Reefs", album_id=3, duration=184, track_number=3, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", image_url=""),
        Song(title="Tide", artist="Coral Reefs", album_id=3, duration=211, track_number=4, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", image_url=""),
        Song(title="Blue Note", artist="Blue Note Ensemble", album_id=4, duration=312, track_number=1, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", image_url=""),
        Song(title="Smooth Operator", artist="Blue Note Ensemble", album_id=4, duration=278, track_number=2, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", image_url=""),
        Song(title="Late Night", artist="Blue Note Ensemble", album_id=4, duration=234, track_number=3, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", image_url=""),
        Song(title="Saxophone Dreams", artist="Blue Note Ensemble", album_id=4, duration=345, track_number=4, audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", image_url=""),
    ]
    for i, s in enumerate(songs):
        s.image_url = f"https://picsum.photos/seed/song{i+1}/400/400"
    for a in albums:
        a.image_url = f"https://picsum.photos/seed/album{a.id}/600/600"
    return albums, songs

async def seed_database(db: AsyncSession):
    result = await db.execute(__import__("sqlalchemy").select(Album).limit(1))
    if result.scalar_one_or_none():
        return
    albums, songs = _seed_data()
    for a in albums:
        db.add(a)
    await db.flush()
    for s in songs:
        db.add(s)
    demo = User(username="demo", email="demo@melodia.app", password_hash=hash_password("demo123"))
    db.add(demo)
    await db.commit()
