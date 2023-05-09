from __future__ import annotations

from apifairy import authenticate, body, response
from flask import Blueprint, abort

from app import db, ma, token_auth
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


class PairSchema(ma.Schema):
    iffield = ma.Str(required=True)
    offield = ma.Str(required=True)


class AddLessonSchema(ma.Schema):
    title = ma.Str(required=True)
    level = ma.Str(required=True)
    topic = ma.Str(required=True)
    pairs = ma.List(ma.Nested(PairSchema))


@lessons.route("/lessons/", methods=["POST"])
@authenticate(token_auth)
@body(AddLessonSchema)
def create(payload: dict) -> tuple:
    lesson = Lesson(**payload)
    db.session.add(lesson)
    db.session.commit()

    user = token_auth.current_user()
    user.lessons.append(lesson)
    db.session.commit()
    return {}, 201
