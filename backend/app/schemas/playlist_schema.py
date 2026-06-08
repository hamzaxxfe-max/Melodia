from pydantic import BaseModel
from typing import List, Optional

class PlaylistCreate(BaseModel):
    name: str
    description: str = ""

class PlaylistResponse(BaseModel):
    id: int
    name: str
    description: str
    user_id: int
    song_count: int = 0

class PlaylistDetail(PlaylistResponse):
    songs: List = []
