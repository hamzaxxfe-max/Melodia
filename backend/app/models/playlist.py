from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from ..db import Base

playlist_songs = Table(
    "playlist_songs", Base.metadata,
    Column("playlist_id", Integer, ForeignKey("playlists.id", ondelete="CASCADE"), primary_key=True),
    Column("song_id", Integer, ForeignKey("songs.id", ondelete="CASCADE"), primary_key=True),
    Column("position", Integer, default=0),
)

class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    songs = relationship("Song", secondary=playlist_songs, lazy="selectin")
