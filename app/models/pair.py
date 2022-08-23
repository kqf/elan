from __future__ import annotations

from flask import url_for

from app import db


class Pair(db.Model):
    __tablename__ = "pairs"
    id = db.Column(db.Integer, primary_key=True)
    iffield = db.Column(db.String(), index=True)
    offield = db.Column(db.String(), index=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), index=True)
    # __table_args__ = (db.UniqueConstraint("iffield", "offield"),)

    def url(self) -> str:
        return url_for("main.pair", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "iffield": self.iffield,
            "offield": self.offield,
            "url": self.url(),
        }
