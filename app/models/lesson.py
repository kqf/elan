from __future__ import annotations

from flask import url_for

from app import db


class Lesson(db.Model):
    __tablename__ = "lessons"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    pairs = db.relationship(
        "Pair", backref="Lesson", lazy="dynamic", cascade="all"
    )

    def url(self) -> str:
        return url_for("main.lesson", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "title": self.title,
            "pairs": "pairs/url",
            "url": self.url(),
        }
