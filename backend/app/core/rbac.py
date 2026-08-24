from enum import Enum
from typing import List

class Role(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    SCHOOL_ADMIN = "SCHOOL_ADMIN"
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"
    PARENT = "PARENT"

# Define permission matrices or hierarchical checks here if needed
def check_role(user_role: str, allowed_roles: List[str]) -> bool:
    return user_role in allowed_roles
