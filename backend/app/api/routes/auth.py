from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import bcrypt
from pydantic import BaseModel
from typing import Optional
import logging
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# ============ PASSWORD FUNCTIONS ============
def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# ============ REGISTER ============
@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"📝 Registration attempt for: {user_data.email}")
        
        # Check if user exists in DATABASE
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            logger.warning(f"⚠️ User already exists: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Save to DATABASE
        db_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            role=getattr(user_data, 'role', 'Member') or 'Member'
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"✅ User registered successfully: {user_data.email}")
        
        # Count total users
        total = db.query(User).count()
        logger.info(f"📊 Total users: {total}")
        
        return UserResponse(
            email=db_user.email,
            full_name=db_user.full_name,
            role=db_user.role
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Registration error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

# ============ LOGIN ============
@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        logger.info(f"🔑 Login attempt for: {form_data.username}")
        
        # Check DATABASE
        user = db.query(User).filter(User.email == form_data.username).first()
        if not user:
            logger.warning(f"⚠️ User not found: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not verify_password(form_data.password, user.hashed_password):
            logger.warning(f"⚠️ Invalid password for: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = create_access_token(
            data={"sub": user.email, "name": user.full_name, "role": user.role}
        )
        
        logger.info(f"✅ Login successful: {form_data.username}")
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                email=user.email,
                full_name=user.full_name,
                role=user.role
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

# ============ GET CURRENT USER ============
@router.get("/me", response_model=UserResponse)
async def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return UserResponse(
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    timezone: Optional[str] = None

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        # Get current user
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update fields
        if user_update.full_name:
            user.full_name = user_update.full_name
        if user_update.email:
            user.email = user_update.email
        if user_update.timezone:
            user.timezone = user_update.timezone
        
        db.commit()
        db.refresh(user)
        
        return UserResponse(
            email=user.email,
            full_name=user.full_name,
            role=user.role
        )
    except Exception as e:
        logger.error(f"Profile update error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Update failed: {str(e)}"
        )