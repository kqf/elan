from __future__ import annotations

from typing import Any

from apifairy import authenticate, response
from flask import Blueprint, abort, request

from app import db, token_auth
from app.models import Lesson, Pair
from app.routes.exception import requires_fields
from app.schemes import LessonSchema

lessons = Blueprint("lessons", __name__)

lesson_schema = LessonSchema()
lessons_schema = LessonSchema(many=True)


@lessons.route("/lessons/", methods=["GET"])
@authenticate(token_auth)
@response(lessons_schema)
def lessons_() -> Lesson:
    user = token_auth.current_user()
    return user.lessons


@lessons.route("/lessons/<int:id>", methods=["GET"])
@authenticate(token_auth)
@response(lesson_schema)
def lesson(id) -> Lesson:
    user = token_auth.current_user()
    if id < 1 or id > len(user.lessons):
        abort(404)
    return user.lessons[id - 1]


@lessons.route("/lessons/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("pairs", "title")
def create_lesson(id: int) -> tuple[dict, int, dict[str, str]]:
    user = token_auth.current_user()
    data: dict[str, str | list[dict[str, str]]] | Any = request.json
    # First create the container
    lesson = Lesson(title=data["title"])
    db.session.add(lesson)
    db.session.commit()

    pairs: list[dict[str, str]] = data["pairs"]  # type: ignore
    # Then create the content
    for pdata in pairs:
        pair = Pair(lesson_id=lesson.id, **pdata)
        db.session.add(pair)
        db.session.commit()

    user.lessons.append(lesson)
    db.session.commit()
    return {}, 201, {}
