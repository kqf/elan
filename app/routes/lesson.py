from __future__ import annotations

from flask import Blueprint, Response, jsonify

from app.models.models import Lesson

lessons = Blueprint("lessons", __name__)


@lessons.route("/lessons/<int:id>", methods=["GET"])
def lesson(id) -> Response:
    return jsonify(Lesson.query.get_or_404(id).export())


@lessons.route("/lessons/<int:id>/data", methods=["GET"])
def lesson_data(id: int) -> Response:
    lesson = Lesson.query.get_or_404(id)
    return jsonify([pair.url() for pair in lesson.pairs.all()])
