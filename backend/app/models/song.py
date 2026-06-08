from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base

class Song(Base):
    __tablename__ = "songs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=True)
    duration = Column(Integer, default=0)
    track_number = Column(Integer, default=1)
    audio_url = Column(String, default="")
    image_url = Column(String, default="")

    album = relationship("Album", back_populates="songs")
