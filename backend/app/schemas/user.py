from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "Member"

class UserResponse(BaseModel):
    email: str
    full_name: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse