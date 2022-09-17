from __future__ import annotations

from apifairy import response
from flask import Blueprint, Response, jsonify

from app.models import Lesson
from app.routes.url import url
from app.schemes import LessonSchema

lessons = Blueprint("lessons", __name__)

lesson_schema = LessonSchema()


@lessons.route("/lessons/<int:id>", methods=["GET"])
@response(lesson_schema)
def lesson(id) -> Response:
    return Lesson.query.get_or_404(id).export()


@lessons.route("/lessons/<int:id>/data", methods=["GET"])
def lesson_data(id: int) -> Response:
    lesson = Lesson.query.get_or_404(id)
    return jsonify([url("pairs.pair", pair) for pair in lesson.pairs.all()])
