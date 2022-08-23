from __future__ import annotations

import datetime

from flask import url_for
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from app import db, lm
from app.models.token import Token


def register(db: SQLAlchemy, username: str, password: str, email: str) -> User:
    user = User(username=username, email=email)
    user.password_hash = generate_password_hash(password)
    db.session.add(user)
    db.session.commit()
    return user


def edit(
    db: SQLAlchemy, user: User, username: str, password: str, email: str
) -> User:
    user.username = username
    user.email = email
    user.password_hash = generate_password_hash(password)
    db.session.add(user)
    db.session.commit()
    return user


def export(user: User) -> dict[str, str]:
    return {
        "username": user.username,
        "url": user.url(),
    }


def password_is_correct(user: User, password: str) -> bool:
    return check_password_hash(user.password_hash, password)


def verify_access_token(db: SQLAlchemy, access_token, refresh_token=None):
    if token := db.session.scalar(Token.query.filter_by(token=access_token)):
        if token.acc_exp > datetime.datetime.now(datetime.timezone.utc):
            return token.user


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(64))
    tokens = db.relationship("Token", back_populates="user", lazy="noload")
    lessons = db.relationship("Lesson", backref="user", lazy="dynamic")

    def url(self) -> str:
        return url_for("main.user", id=self.id, _external=True)


@lm.user_loader
def load_user(id):  # sourcery skip: instance-method-first-arg-name
    return User.query.get(int(id))
