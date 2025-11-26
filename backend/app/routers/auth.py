import aiosmtplib
from .. import schemas
from pathlib import Path
from ..database import db
from typing import Optional
from jose import jwt, JWTError
from email.message import EmailMessage
from passlib.hash import sha256_crypt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..configs import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SUPER_ADMINS,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_TOKEN_EXPIRE_HOURS,
    DOMAIN,
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


def create_verification_token(email: str):
    """
    Only for registering an user account
    """
    expires_hours = EMAIL_TOKEN_EXPIRE_HOURS
    expire = datetime.now(timezone.utc) + timedelta(hours=expires_hours)
    data = {"sub": email, "exp": expire}  # when registering email is the subject
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(
    data: dict,
    role: str = "user",
    expires_delta: Optional[timedelta] = None,
):
    """
    Access token is used for identifying user
    """
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


def get_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=400, detail="User ID not found in token")
    return user_id


def require_admin(user=Depends(get_current_user)):
    if user["admin"]:
        return user
    raise HTTPException(status_code=403, detail="Admin access required")


def require_super_admin(user=Depends(get_current_user)):
    if user["sub"] in SUPER_ADMINS:
        return user
    raise HTTPException(status_code=403, detail="Super admin access required")


async def send_verification_email(to_email: str, token: str):
    verify_link = f"http://{DOMAIN}/verify/?token={token}"
    message = EmailMessage()
    message["From"] = EMAIL_USER
    message["To"] = to_email
    message["Subject"] = "Verify your email"
    message.set_content(f"Click the link to verify your account: {verify_link}")
    template_path = Path(__file__).resolve().parent.parent / "templates" / "verify.html"
    html_content = template_path.read_text(encoding="utf-8").format(
        verify_link=verify_link
    )
    message.add_alternative(html_content, subtype="html")
    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=EMAIL_USER,
        password=EMAIL_PASS,
    )


@router.post("/register/")
async def register_user(user: schemas.UserCreate):
    admin = user.email in SUPER_ADMINS
    existing_user = await db.get_user(email=user.email)
    if existing_user and existing_user.get("verified"):
        raise HTTPException(status_code=409, detail="User already exists")
    await db.add_pending_user(
        dict(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=sha256_crypt.hash(user.password),
            admin=admin,
        )
    )
    token = create_verification_token(user.email)
    await send_verification_email(user.email, token)


def get_token(user) -> schemas.Token:
    role = "admin" if user["admin"] else "user"
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"] if user.get("id") else user["email"]},
        role=role,
        expires_delta=access_token_expires,
    )
    return schemas.Token(
        access_token=access_token, token_type="bearer", admin=(role == "admin")
    )


@router.get("/verify/", status_code=201, response_model=schemas.Token)
async def verify_email(token: str):
    """
    This function is for verifying email with verification token

    Returns: Access token when verified
    """
    payload = verify_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = await db.verify_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_token(user)


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
    return get_token(user)


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
async def get_user_details(user_id: str = Depends(get_user_id)):
    user_data = await db.get_user(user_id=user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return schemas.User(**user_data)


@router.patch("/update/")
async def update_user_details(
    user_data: schemas.UserUpdate, user_id: str = Depends(get_user_id)
):
    return await db.update_user(user_id, data=user_data)
