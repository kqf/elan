from __future__ import annotations

from apifairy import response
from flask import Blueprint, Response

from app.models import Lesson
from app.schemes import LessonSchema, PairSchema

lessons = Blueprint("lessons", __name__)

lesson_schema = LessonSchema()
lessons_schema = LessonSchema(many=True)
pairs_schema = PairSchema(many=True)


@lessons.route("/lessons/", methods=["GET"])
@response(lessons_schema)
def lessons_() -> Lesson:
    return Lesson.query.all()


@lessons.route("/lessons/<int:id>", methods=["GET"])
@response(lesson_schema)
def lesson(id) -> Lesson:
    return Lesson.query.get_or_404(id)


@lessons.route("/lessons/<int:id>/data", methods=["GET"])
@response(pairs_schema)
def lesson_data(id: int) -> Response:
    lesson = Lesson.query.get_or_404(id)
    return lesson.pairs.all()
