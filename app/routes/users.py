from __future__ import annotations

from typing import Any

from apifairy import authenticate
from flask import Blueprint, Response, jsonify, request

import app.models.models as users_
from app import db, token_auth
from app.models.models import Lesson, Pair
from app.routes.exception import requires_fields
from app.routes.url import url


users = Blueprint("users", __name__)


@users.route("/users/", methods=["GET"])
@authenticate(token_auth)
def uusers() -> Response:
    return jsonify({"users": [u.url() for u in users_.User.query.all()]})


@users.route("/users/<int:id>", methods=["GET"])
@authenticate(token_auth)
def user(id: int) -> Response:
    return jsonify(users_.export(users_.User.query.get_or_404(id)))


@users.route("/users/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("username", "password", "email")
def create() -> tuple[Response, int, dict[str, str]]:
    user = users_.register(db, **request.json)  # type: ignore
    return jsonify({}), 201, {"Location": user.url()}


@users.route("/users/<int:id>", methods=["PUT"])
@authenticate(token_auth)
@requires_fields("username", "password", "email")
def update(id: int) -> Response:
    users_.edit(
        db, users_.User.query.get_or_404(id), **request.json
    )  # type: ignore
    return jsonify({})


@users.route("/users/<int:id>/lessons/", methods=["GET"])
@authenticate(token_auth)
def users_lessons(id: int) -> Response:
    user = users_.User.query.get_or_404(id)
    return jsonify(
        {
            "lessons": [
                url("lessons.lesson", lesson) for lesson in user.lessons.all()
            ]
        }
    )


@users.route("/users/<int:id>/lessons/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("pairs", "title")
def user_build_lesson(id: int) -> tuple[Response, int, dict[str, str]]:
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

    return jsonify({}), 201, {"Location": lesson.url()}
