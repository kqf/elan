from __future__ import annotations

from typing import Any

from apifairy import authenticate, response
from flask import Blueprint, request, url_for

import app.models as users_
from app import db, token_auth
from app.models import Lesson, Pair
from app.routes.exception import requires_fields
from app.routes.url import url
from app.schemes import UserSchema

users = Blueprint("users", __name__)
users_schema = UserSchema(many=True)
user_schema = UserSchema()


@users.route("/users/", methods=["GET"])
@authenticate(token_auth)
@response(users_schema)
def uusers() -> users_.User:
    return users_.User.query.all()


@users.route("/users/<int:id>", methods=["GET"])
@authenticate(token_auth)
@response(user_schema)
def user(id: int) -> users_.User:
    return users_.User.query.get_or_404(id)


@users.route("/users/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("username", "password", "email")
def create() -> tuple[dict, int, dict[str, str]]:
    user = users_.register(db, **request.json)  # type: ignore
    return (
        {},
        201,
        {"Location": url_for("users.user", id=user.id, follow_redirects=True)},
    )


@users.route("/users/<int:id>", methods=["PUT"])
@authenticate(token_auth)
@requires_fields("username", "password", "email")
def update(id: int) -> dict:
    users_.edit(
        db, users_.User.query.get_or_404(id), **request.json
    )  # type: ignore
    return {}


@users.route("/users/<int:id>/lessons/", methods=["GET"])
@authenticate(token_auth)
def users_lessons(id: int) -> dict[str, list[str]]:
    user = users_.User.query.get_or_404(id)
    return {
        "lessons": [
            url("lessons.lesson", lesson) for lesson in user.lessons.all()
        ]
    }


@users.route("/users/<int:id>/lessons/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("pairs", "title")
def user_build_lesson(id: int) -> tuple[dict, int, dict[str, str]]:
    user = users_.User.query.get_or_404(id)
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

    return (
        {},
        201,
        {
            "Location": url_for(
                "lessons.lesson", id=lesson.id, follow_redirects=True
            )
        },
    )
