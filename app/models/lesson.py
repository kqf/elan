from __future__ import annotations

from typing import Any

from flask import Response, jsonify, request, url_for

from app import db
from app.main import main
from app.models.exception import requires_fields
from app.models.pair import Pair


class Lesson(db.Model):
    __tablename__ = "lessons"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    pairs = db.relationship(
        "Pair", backref="Lesson", lazy="dynamic", cascade="all, delete-orphan"
    )

    def url(self) -> str:
        return url_for("main.lessons", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "title": self.title,
            "pairs": "pairs/url",
            "url": self.url(),
        }


@main.route("/lessons/", methods=["POST"])
@requires_fields("pairs", "title")
def build_lesson() -> tuple[Response, int, dict[str, str]]:
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

    return jsonify({}), 201, {"Location": lesson.url()}


@main.route("/lessons/<int:id>", methods=["GET"])
def lesson(id) -> Response:
    return jsonify(Lesson.query.get_or_404(id).export())


@main.route("/lessons/<int:id>", methods=["POST"])
@requires_fields("data")
def build_lesson(id: int) -> tuple[Response, int, dict[str, str]]:
    data: dict[str, str] | Any = request.json
    # First create the container
    lesson = Lesson(id=id)
    db.add(lesson)
    db.commit()

    # Then create the content
    for pid, pdata in enumerate(data["pairs"]):
        pair = Pair(id=pid, lesson=id, **pdata)
        db.add(pair)
        db.commit()

    return jsonify({}), 201, {"Location": lesson.url()}
