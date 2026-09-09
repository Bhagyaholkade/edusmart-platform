from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

parent_student = Table(
    "parent_student",
    Base.metadata,
    Column("parent_id", String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("student_id", String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)

class TeacherAssignment(Base):
    __tablename__ = "teacher_assignments"
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"))
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"))
    
    teacher = relationship("User", back_populates="teacher_assignments")
    classroom = relationship("ClassRoom")
    subject = relationship("Subject")

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
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True) # For students
    
    school = relationship("School", back_populates="users")
    classroom = relationship("ClassRoom", back_populates="students")
    
    teacher_assignments = relationship("TeacherAssignment", back_populates="teacher")
    
    children = relationship(
        "User", 
        secondary=parent_student,
        primaryjoin=(id == parent_student.c.parent_id),
        secondaryjoin=(id == parent_student.c.student_id),
        backref="parents"
    )
    
    # Relationships for other domains
    # attendances = relationship("AttendanceRecord", back_populates="student")
    # marks = relationship("AssessmentResult", back_populates="student")
