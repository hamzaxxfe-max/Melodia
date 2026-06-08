from pydantic import BaseModel
from typing import Optional

class SongResponse(BaseModel):
    id: int
    title: str
    artist: str
    album_id: Optional[int] = None
    album_title: Optional[str] = None
    duration: int
    track_number: int
    audio_url: str
    image_url: str

class SongDetail(SongResponse):
    pass
