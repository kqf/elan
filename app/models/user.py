from __future__ import annotations

import datetime
from time import time
from typing import Any

import jwt
import sqlalchemy as sqla
from apifairy import authenticate
from flask import Response, current_app, jsonify, request, url_for
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from app import db, lm
from app.main import main
from app.models.exception import requires_fields
from app.models.lesson import Lesson
from app.models.pair import Pair
from app.models.token import Token

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(64))
    tokens = db.relationship("Token", back_populates="user", lazy="noload")
    lessons = db.relationship("Lesson", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def register(username, password, email) -> User:
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

    def __repr__(self):
        return "<User {0}>".format(self.username)

    def url(self) -> str:
        return url_for("main.user", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "name": self.username,
            "url": self.url(),
        }

    def fromdict(self, data: dict[str, str] | Any) -> User:
        self.username = data["name"]
        self.set_password(data["password"])
        return self

    @staticmethod
    def verify_access_token(access_token, refresh_token=None):
        if token := db.session.scalar(
            Token.query.filter_by(access_token=access_token)
        ):
            if token.acc_exp > datetime.datetime.now(datetime.timezone.utc):
                return token.user

    @staticmethod
    def verify_refresh_token(refresh_token, access_token):
        if token := db.session.scalar(
            Token.query.filter_by(
                refresh_token=refresh_token, access_token=access_token
            )
        ):
            if token.refresh_expiration > datetime.datetime.now(
                datetime.timezone.utc
            ):
                return token
            db.session.execute(Token.delete().where(Token.user == token.user))
            db.session.commit()

    @staticmethod
    def generate_reset_token():
        return jwt.encode(
            {
                "exp": time() + current_app.config["RESET_TOKEN_MINUTES"] * 60,
            },
            current_app.config["SECRET_KEY"],
            algorithm="HS256",
        )

    @staticmethod
    def verify_reset_token(reset_token):
        try:
            data = jwt.decode(
                reset_token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"],
            )
        except jwt.PyJWTError:
            return
        return db.session.scalar(
            User.query.filter_by(email=data["reset_email"])
        )


@lm.user_loader
def load_user(id):  # sourcery skip: instance-method-first-arg-name
    return User.query.get(int(id))


@main.route("/users/", methods=["GET"])
@authenticate(token_auth)
def users() -> Response:
    return jsonify({"users": [u.url() for u in User.query.all()]})


@main.route("/users/<int:id>", methods=["GET"])
@authenticate(token_auth)
def user(id: int) -> Response:
    return jsonify(User.query.get_or_404(id).export())


@main.route("/users/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("name", "password", "email")
def create() -> tuple[Response, int, dict[str, str]]:
    user = User(email=request.json["email"])
    user.fromdict(request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({}), 201, {"Location": user.url()}


@main.route("/users/<int:id>", methods=["PUT"])
@authenticate(token_auth)
@requires_fields("name", "password")
def update(id: int) -> Response:
    user = User.query.get_or_404(id)
    user.fromdict(request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({})


@main.route("/users/<int:id>/lessons/", methods=["GET"])
@authenticate(token_auth)
def users_lessons(id: int) -> Response:
    user = User.query.get_or_404(id)
    return jsonify(
        {"lessons": [lesson.url() for lesson in user.lessons.all()]}
    )


@main.route("/users/<int:id>/lessons/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("pairs", "title")
def user_build_lesson(id: int) -> tuple[Response, int, dict[str, str]]:
    user = User.query.get_or_404(id)
    data: dict[str, str | list[dict[str, str]]] | Any = request.json
    # First create the container
    lesson = Lesson(user=user, title=data["title"])
    db.session.add(lesson)
    db.session.commit()

    pairs: list[dict[str, str]] = data["pairs"]  # type: ignore
    # Then create the content
    for pdata in pairs:
        pair = Pair(lesson_id=lesson.id, **pdata)
        db.session.add(pair)
        db.session.commit()

    return jsonify({}), 201, {"Location": lesson.url()}


def generate_auth_token(user: User) -> Token:
    token = Token(user=user)
    token.generate()
    return token


@main.route("/tokens", methods=["POST"])
@authenticate(basic_auth)
def new():
    token = generate_auth_token(basic_auth.current_user())
    db.session.add(token)
    db.session.commit()
    # Token.clean()  # keep token table clean of old tokens
    return (
        {
            "access_token": token.access_token,
            "refresh_token": token.refresh_token,
        },
        200,
        {},
    )


@basic_auth.verify_password
def verify_password(username, password):
    if username and password:
        user = db.session.scalar(
            User.query.filter(
                sqla.or_(
                    User.username.like(username),
                    User.email.like(username),
                )
            )
        )
        if user and user.verify_password(password):
            return user


@token_auth.verify_token
def verify_token(access_token):
    if current_app.config["DISABLE_AUTH"]:
        return db.session.get(User, 1)
    if access_token:
        return User.verify_access_token(access_token)
