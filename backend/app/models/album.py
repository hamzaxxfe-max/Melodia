from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..db import Base

class Album(Base):
    __tablename__ = "albums"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    image_url = Column(String, default="")
    release_year = Column(Integer, default=2024)

    songs = relationship("Song", back_populates="album", cascade="all, delete-orphan", order_by="Song.track_number")
