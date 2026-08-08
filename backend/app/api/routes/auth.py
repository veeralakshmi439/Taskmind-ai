from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Optional
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Mock user database
mock_users = {
    "ava@taskmind.ai": {
        "email": "ava@taskmind.ai",
        "full_name": "Ava Mercer",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password123"
        "role": "Product Lead"
    }
}

@router.post("/register")
async def register(email: str, full_name: str, password: str):
    if email in mock_users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(password)
    mock_users[email] = {
        "email": email,
        "full_name": full_name,
        "hashed_password": hashed_password,
        "role": "Member"
    }
    
    return {"message": "User created successfully", "email": email}

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = mock_users.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "name": user["full_name"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }

@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    from app.core.security import decode_access_token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    email = payload.get("sub")
    user = mock_users.get(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return {
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"]
    }