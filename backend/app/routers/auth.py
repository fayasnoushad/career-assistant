from .. import schemas
from ..database import db
from typing import Optional
from jose import jwt, JWTError
from passlib.hash import sha256_crypt
from datetime import datetime, timedelta, timezone
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordBearer
from ..configs import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SUPER_ADMINS,
)

router = APIRouter(prefix="/auth", tags=["auth", "authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def verify_token(token: str):
    secret_key = SECRET_KEY
    try:
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def create_access_token(
    data: dict,
    role: str = "user",
    expires_delta: Optional[timedelta] = None,
):
    secret_key = SECRET_KEY
    to_encode = data.copy()
    to_encode["admin"] = role == "admin"
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = verify_token(token)
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_admin(user=Depends(get_current_user)):
    if user["admin"]:
        return user
    raise HTTPException(status_code=403, detail="Admin access required")


def require_super_admin(user=Depends(get_current_user)):
    if user["sub"] in SUPER_ADMINS:
        return user
    raise HTTPException(status_code=403, detail="Super admin access required")


@router.post("/register/", response_model=schemas.Token, status_code=201)
async def register_user(user: schemas.UserCreate):
    admin = user.email in SUPER_ADMINS
    user_exists = await db.get_user(user.email)
    if user_exists:
        raise HTTPException(status_code=409, detail="User already exists")
    await db.add_user(
        dict(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=sha256_crypt.hash(user.password),
            admin=admin,
        )
    )
    role = "admin" if admin else "user"
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, role=role, expires_delta=access_token_expires
    )
    return schemas.Token(
        access_token=access_token, token_type="bearer", admin=(role == "admin")
    )


@router.post("/login/", response_model=schemas.Token)
async def login_for_access_token(user_data: schemas.UserLogin):
    email = user_data.email
    user = await db.get_user(email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    auth_status = sha256_crypt.verify(user_data.password, user["password"])
    if not auth_status:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    role = "admin" if user["admin"] else "user"
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, role=role, expires_delta=access_token_expires
    )
    return schemas.Token(
        access_token=access_token, token_type="bearer", admin=(role == "admin")
    )


@router.get("/check/", response_model=schemas.LoginStatus)
def login_status_check(token: str = Depends(oauth2_scheme)):
    try:
        payload = verify_token(token)
        if not payload or payload.get("sub") is None:
            return schemas.LoginStatus(status=False)
        return schemas.LoginStatus(status=True)
    except:
        return schemas.LoginStatus(status=False)


@router.post("/details/", response_model=schemas.User)
async def get_user_details(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=400, detail="Email not found in token")
    user_data = await db.get_user(email=email)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return schemas.User(**user_data)


@router.patch("/update")
async def update_user_details(
    user_data: schemas.UserUpdate, token: str = Depends(oauth2_scheme)
):
    payload = verify_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=400, detail="Email not found in token")
    return await db.update_user(email=email, data=user_data)
