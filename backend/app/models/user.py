from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    # Use Supabase's UUID as the primary key
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True, nullable=True)
    # Password is handled by Supabase Auth, but keeping a placeholder just in case
    # hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, index=True) # SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True) # For students
    
    school = relationship("School", back_populates="users")
    classroom = relationship("ClassRoom", back_populates="students")
    
    # Relationships for other domains
    # attendances = relationship("AttendanceRecord", back_populates="student")
    # marks = relationship("AssessmentResult", back_populates="student")
