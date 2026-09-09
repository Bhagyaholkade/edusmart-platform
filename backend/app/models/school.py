from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

classroom_subjects = Table(
    "classroom_subjects",
    Base.metadata,
    Column("classroom_id", Integer, ForeignKey("classes.id", ondelete="CASCADE"), primary_key=True),
    Column("subject_id", Integer, ForeignKey("subjects.id", ondelete="CASCADE"), primary_key=True),
)

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
    school_id = Column(Integer, ForeignKey("schools.id", ondelete="CASCADE"))
    grade_level = Column(String) # e.g., "10", "11", "12"
    section = Column(String) # e.g., "A", "B"
    
    school = relationship("School", back_populates="classes")
    students = relationship("User", back_populates="classroom")
    subjects = relationship("Subject", secondary=classroom_subjects, back_populates="classes")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, index=True, unique=True)
    
    classes = relationship("ClassRoom", secondary=classroom_subjects, back_populates="subjects")
