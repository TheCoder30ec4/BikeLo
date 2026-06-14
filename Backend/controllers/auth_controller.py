from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from DataBase.core import get_db
from DTOs.auth_DTO import (
    ForgotPasswordRequest,
    LoginRequest,
    RefreshRequest,
    ResetPasswordRequest,
    SignupRequest,
    TokenResponse,
    UpdateRoleRequest,
    UserResponse,
    VerifyOTPRequest,
)
from dependencies.auth import CurrentUser, RequireAdmin
from services.auth_service import AuthService
from utils.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
@limiter.limit("5/minute")
def signup(
    request: Request,
    data: SignupRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    access, refresh = service.signup(data)
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        token_type="bearer",
    )


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(
    request: Request,
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    """Frontend JSON login endpoint"""
    service = AuthService(db)
    access, refresh = service.login(data)
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        token_type="bearer",
    )


@router.post("/swagger-token", response_model=TokenResponse, include_in_schema=False)
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """FastAPI Swagger UI login form endpoint"""
    service = AuthService(db)
    login_data = LoginRequest(email=form_data.username, password=form_data.password)
    access, refresh = service.login(login_data)
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        token_type="bearer",
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(
    data: RefreshRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    access, refresh = service.refresh_tokens(data.refresh_token)
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        token_type="bearer",
    )


@router.get("/me")
def me(current_user: CurrentUser) -> dict:
    """Current user info (requires Bearer token). Example of RBAC-protected route."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "status": current_user.status,
    }


# --- Admin-only (RBAC) ---
@router.get("/admin/users", response_model=list[UserResponse])
def list_all_users(
    _: RequireAdmin,
    db: Session = Depends(get_db),
) -> list[UserResponse]:
    """Admin: list all users (no password in response)."""
    service = AuthService(db)
    users = service.list_all_users()
    return [UserResponse.model_validate(u) for u in users]


@router.patch("/admin/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    data: UpdateRoleRequest,
    _: RequireAdmin,
    db: Session = Depends(get_db),
) -> UserResponse:
    """Admin: change a user's role (user | admin)."""
    service = AuthService(db)
    service.update_user_role(user_id, data.role)
    user = service.user_repo.get_by_id(user_id)
    return UserResponse.model_validate(user)


@router.post("/verify-otp")
def verify_otp(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    """Verify OTP and activate account."""
    service = AuthService(db)
    return service.verify_account(data)


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Send reset link/OTP to email."""
    service = AuthService(db)
    return service.forgot_password(data.email)


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password with OTP from email."""
    service = AuthService(db)
    return service.reset_password(data)
