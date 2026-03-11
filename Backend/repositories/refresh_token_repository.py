from datetime import datetime
from sqlalchemy.orm import Session

from tables.refresh_tokens import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, jti: str, expires_at: datetime) -> RefreshToken:
        token = RefreshToken(user_id=user_id, jti=jti, expires_at=expires_at)
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token

    def get_by_jti(self, jti: str) -> RefreshToken | None:
        return (
            self.db.query(RefreshToken)
            .filter(RefreshToken.jti == jti, RefreshToken.revoked.is_(False))
            .first()
        )

    def revoke_by_jti(self, jti: str) -> None:
        token = self.db.query(RefreshToken).filter(RefreshToken.jti == jti).first()
        if token:
            token.revoked = True
            self.db.commit()

    def revoke_all_for_user(self, user_id: int) -> None:
        self.db.query(RefreshToken).filter(RefreshToken.user_id == user_id).update(
            {"revoked": True}
        )
        self.db.commit()
