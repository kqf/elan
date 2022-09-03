from __future__ import annotations

from flask import Blueprint, Response, jsonify

from app.models.models import Lesson
from app.routes.url import url

lessons = Blueprint("lessons", __name__)


@lessons.route("/lessons/<int:id>", methods=["GET"])
def lesson(id) -> Response:
    return jsonify(Lesson.query.get_or_404(id).export())


@lessons.route("/lessons/<int:id>/data", methods=["GET"])
def lesson_data(id: int) -> Response:
    lesson = Lesson.query.get_or_404(id)
    return jsonify([url("pairs.pair", pair) for pair in lesson.pairs.all()])
