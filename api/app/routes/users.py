from __future__ import annotations

from typing import Any

from apifairy import authenticate, body, response
from flask import Blueprint, url_for

from app import db, ma, token_auth
from app.models import User, edit_user, register_user
from app.schemes import UserSchema

users = Blueprint("users", __name__)
users_schema = UserSchema(many=True)
user_schema = UserSchema()


@users.route("/users/", methods=["GET"])
@response(users_schema)
def uusers() -> User:
    return User.query.all()


@users.route("/users/me/", methods=["GET"])
@authenticate(token_auth)
@response(user_schema)
def me() -> User:
    return token_auth.current_user()


@users.route("/users/<int:id>", methods=["GET"])
@authenticate(token_auth)
@response(user_schema)
def user(id: int) -> User:
    return User.query.get_or_404(id)


class RegisterSchema(ma.Schema):
    username = ma.Str(required=True)
    password = ma.Str(required=True)
    email = ma.Str(required=True)


@users.route("/users/", methods=["POST"])
@body(RegisterSchema)
def create(payload: dict[str, Any]) -> tuple[dict, int, dict[str, str]]:
    user = register_user(db, **payload)
    return (
        {},
        201,
        {"Location": url_for("users.user", id=user.id, follow_redirects=True)},
    )


@users.route("/users/<int:id>", methods=["PUT"])
@authenticate(token_auth)
@body(RegisterSchema)
def update(payload: dict[str, Any], id: int) -> dict:
    edit_user(db, User.query.get_or_404(id), **payload)
    return {}


@users.route("/users/<int:id>/lessons/", methods=["GET"])
@authenticate(token_auth)
def users_lessons(id: int) -> dict[str, list[str]]:
    user = User.query.get_or_404(id)
    return {
        "lessons": [
            url_for("lessons.lesson", id=lesson.id, follow_redirects=True)
            for lesson in user.lessons.all()
        ]
    }
