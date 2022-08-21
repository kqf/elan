import secrets
from datetime import datetime, timedelta, timezone

from flask import current_app

from app import db


class Token(db.Model):
    __tablename__ = "tokens"
    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.String(64), nullable=False, index=True)
    access_expiration = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    user = db.relationship("User", back_populates="tokens")

    def generate(self):
        self.access_token = secrets.token_urlsafe()
        self.access_expiration = datetime.now(timezone.utc) + timedelta(
            minutes=current_app.config["ACCESS_TOKEN_MINUTES"]
        )

    def expire(self):
        self.access_expiration = datetime.now(timezone.utc)

    @property
    def acc_exp(self):
        return self.access_expiration.replace(tzinfo=timezone.utc)

    @staticmethod
    def clean():
        """Remove any tokens that have been expired for more than a day."""
        yesterday = datetime.now(timezone.utc) - timedelta(days=1)
        db.session.execute(
            Token.query.filter(Token.access_expiration < yesterday).delete()
        )
