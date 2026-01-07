from datetime import datetime, timedelta
from passlib.context import CryptContext

from jose import JWTError, jwt
from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_session
from models.admin import Admin
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
SECRET_KEY = "SECRET_TRES_FORT"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_async_session)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401)

    except JWTError:
        raise HTTPException(status_code=401)

    result = await db.execute(
        select(Admin).where(Admin.email == email)
    )
    admin = result.scalar_one_or_none()

    if admin is None:
        raise HTTPException(status_code=401)

    return admin

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hash_password: str) -> bool:
    return pwd_context.verify(password, hash_password)

def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
