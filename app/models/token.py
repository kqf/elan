import secrets
from datetime import datetime, timedelta, timezone

from flask import current_app

from app import db


class Token(db.Model):
    __tablename__ = "tokens"
    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.String(64), nullable=False, index=True)
    access_expiration = db.Column(db.DateTime, nullable=False)
    refresh_token = db.Column(db.String(64), nullable=False, index=True)
    refresh_expiration = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    user = db.relationship("User", back_populates="tokens")

    def generate(self):
        self.access_token = secrets.token_urlsafe()
        self.access_expiration = datetime.now(timezone.utc) + timedelta(
            minutes=current_app.config["ACCESS_TOKEN_MINUTES"]
        )

        self.refresh_token = secrets.token_urlsafe()
        self.refresh_expiration = datetime.now(timezone.utc) + timedelta(
            days=current_app.config["REFRESH_TOKEN_DAYS"]
        )

    def expire(self):
        self.access_expiration = datetime.now(timezone.utc)
        self.refresh_expiration = datetime.now(timezone.utc)

    @staticmethod
    def clean():
        """Remove any tokens that have been expired for more than a day."""
        yesterday = datetime.now(timezone.utc) - timedelta(days=1)
        db.session.execute(
            Token.delete().where(Token.refresh_expiration < yesterday)
        )
