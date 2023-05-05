from __future__ import annotations

from apifairy import authenticate, response
from flask import Blueprint, abort

from app import token_auth
from app.models import Lesson
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
@response(lesson_schema)
def create() -> int:
    user = token_auth.current_user()
    print(user)
    return 201
