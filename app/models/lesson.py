from __future__ import annotations

from flask import Response, jsonify, url_for

from app import db
from app.main import main


class Lesson(db.Model):
    __tablename__ = "lessons"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    pairs = db.relationship(
        "Pair", backref="Lesson", lazy="dynamic", cascade="all, delete-orphan"
    )

    def url(self) -> str:
        return url_for("main.lesson", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "title": self.title,
            "pairs": "pairs/url",
            "url": self.url(),
        }
        

@main.route("/lesson/<int:id>", methods=["GET"])
def lesson(id) -> Response:
    return jsonify(Lesson.query.get_or_404(id).export())

