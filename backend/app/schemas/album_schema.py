from pydantic import BaseModel
from typing import List, Optional

class AlbumResponse(BaseModel):
    id: int
    title: str
    artist: str
    image_url: str
    release_year: int
    song_count: int = 0

class AlbumDetail(AlbumResponse):
    songs: List = []
