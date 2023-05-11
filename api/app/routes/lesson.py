from __future__ import annotations

from dataclasses import dataclass, field

import marshmallow_dataclass
from apifairy import authenticate, body, response
from flask import Blueprint, abort

from api.app.models import Pair
from app import db, token_auth
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


@dataclass
class PairPayload:
    iffield: str
    offield: str


@dataclass
class LessonPayload:
    title: str
    level: str
    topic: str
    pairs: list[PairPayload] = field(default_factory=list)


AddLessonSchema = marshmallow_dataclass.class_schema(LessonPayload)()


@lessons.route("/lessons/", methods=["POST"])
@authenticate(token_auth)
@body(AddLessonSchema)
def create(payload: LessonPayload) -> tuple:
    lesson = Lesson(
        title=payload.title,
        level=payload.level,
        topic=payload.topic,
    )

    user = token_auth.current_user()
    user.lessons.append(lesson)
    db.session.commit()
    for pdata in payload.pairs:
        pair = Pair(iffield=pdata.iffield, offield=pdata.offield)
        lesson.pairs.append(pair)
        db.session.commit()
    return {}, 201
