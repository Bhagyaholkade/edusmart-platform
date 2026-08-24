from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    users = relationship("User", back_populates="school")
    classes = relationship("ClassRoom", back_populates="school")

class ClassRoom(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    grade_level = Column(String) # e.g., "10", "11", "12"
    section = Column(String) # e.g., "A", "B"
    
    school = relationship("School", back_populates="classes")
    students = relationship("User", back_populates="classroom")
