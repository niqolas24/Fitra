"""Authentication routes for signup and user management."""

import uuid
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import bcrypt

from app.db import get_db
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

class SignupResponse(BaseModel):
    success: bool
    message: str
    email: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user_id: str | None = None
    email: str | None = None

@router.post("/signup", response_model=SignupResponse)
async def signup(req: SignupRequest, db: Session = Depends(get_db)):
    """Create a new user account."""
    
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password_hash = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    user = User(
        id=str(uuid.uuid4()),
        email=req.email.lower(),
        password_hash=password_hash,
        name=req.name,
    )
    db.add(user)
    db.commit()
    
    return SignupResponse(
        success=True,
        message="Account created successfully",
        email=user.email,
    )

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Verify credentials (used by NextAuth Credentials provider)."""
    
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not bcrypt.checkpw(req.password.encode("utf-8"), user.password_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return LoginResponse(
        success=True,
        message="Login successful",
        user_id=user.id,
        email=user.email,
    )
