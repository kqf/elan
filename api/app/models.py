from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone

from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from app import db


def register_user(
    db: SQLAlchemy,
    username: str,
    password: str,
    email: str,
) -> User:
    user = User(username=username, email=email)
    user.password_hash = generate_password_hash(password)
    db.session.add(user)
    db.session.commit()
    return user


def edit_user(
    db: SQLAlchemy, user: User, username: str, password: str, email: str
) -> User:
    user.username = username
    user.email = email
    user.password_hash = generate_password_hash(password)
    db.session.add(user)
    db.session.commit()
    return user


def password_is_correct(user: User, password: str) -> bool:
    return check_password_hash(user.password_hash, password)


def verify_access_token(db: SQLAlchemy, access_token, refresh_token=None):
    if token := db.session.scalar(Token.query.filter_by(token=access_token)):
        if token.acc_exp > datetime.now(timezone.utc):
            return token.user


class Token(db.Model):
    __tablename__ = "tokens"
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(64), nullable=False, index=True)
    expiration = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    user = db.relationship("User", back_populates="tokens")

    def generate(self):
        self.token = secrets.token_urlsafe()
        self.expiration = datetime.now(timezone.utc) + timedelta(
            minutes=current_app.config["ACCESS_TOKEN_MINUTES"]
        )

    def expire(self):
        self.expiration = datetime.now(timezone.utc)

    @property
    def acc_exp(self):
        return self.expiration.replace(tzinfo=timezone.utc)

    @staticmethod
    def clean():
        """Remove any tokens that have been expired for more than a day."""
        yesterday = datetime.now(timezone.utc) - timedelta(days=1)
        db.session.execute(
            Token.query.filter(Token.expiration < yesterday).delete()
        )


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(64))
    tokens = db.relationship("Token", back_populates="user", lazy="noload")
    lessons = db.relationship("Lesson", backref="user", lazy="dynamic")


class Lesson(db.Model):
    __tablename__ = "lessons"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    pairs = db.relationship(
        "Pair", backref="Lesson", lazy="dynamic", cascade="all, delete-orphan"
    )


class Pair(db.Model):
    __tablename__ = "pairs"
    id = db.Column(db.Integer, primary_key=True)
    iffield = db.Column(db.String(), index=True)
    offield = db.Column(db.String(), index=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), index=True)
    # __table_args__ = (db.UniqueConstraint("iffield", "offield"),)


class Genre(db.Model):
    __tablename__ = "genres"
    id = db.Column(
        db.Integer,
        primary_key=True,
        unique=True,
        autoincrement=True,
    )
    name = db.Column(db.String)


class Movie(db.Model):
    __tablename__ = "movies"
    id = db.Column(
        db.Integer,
        primary_key=True,
        unique=True,
        autoincrement=True,
    )
    title = db.Column(db.String)
    genre_id = db.Column(db.Integer, db.ForeignKey("genres.id"))
    genre = db.relationship("Genre")
    numberInStock = db.Column(db.Integer)
    dailyRentalRate = db.Column(db.Float)
    publishDate = db.Column(db.String)
    liked = db.Column(db.Boolean)
