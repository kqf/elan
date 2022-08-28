from __future__ import annotations

from flask import Response, jsonify

from app import main
from app.models.lesson import Lesson


@main.route("/lessons/<int:id>", methods=["GET"])
def lesson(id) -> Response:
    return jsonify(Lesson.query.get_or_404(id).export())


@main.route("/lessons/<int:id>/data", methods=["GET"])
def lesson_data(id: int) -> Response:
    lesson = Lesson.query.get_or_404(id)
    return jsonify([pair.url() for pair in lesson.pairs.all()])
