from __future__ import annotations

from typing import Any

from flask import Response, jsonify, request, url_for

from app import db
from app.main import main
from app.models.exception import ValidationError, requires_fields


class Pair(db.Model):
    __tablename__ = "pairs"
    id = db.Column(db.Integer, primary_key=True)
    iffield = db.Column(db.String(), index=True)
    offield = db.Column(db.String(), index=True)
    # __table_args__ = (db.UniqueConstraint("iffield", "offield"),)

    def url(self) -> str:
        return url_for("main.pair", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "iffield": self.iffield,
            "offield": self.offield,
            "url": self.url(),
        }


@main.route("/pairs/", methods=["POST"])
@requires_fields("iffield", "offield")
def create_pair() -> tuple[Response, int, dict[str, str]]:
    data: dict[str, str] | Any = request.json
    pair = Pair(iffield=data["iffield"], offield=data["offield"])
    db.session.add(pair)
    db.session.commit()
    return jsonify({}), 201, {"Location": pair.url()}


@main.route("/pairs/<int:id>", methods=["PUT"])
def update_pair(id: int) -> Response:
    pair: Pair = Pair.query.get_or_404(id)

    data: dict[str, str] | Any = request.json

    if "iffield" not in data:
        raise ValidationError(f"Input has no 'iffield' field. Got {data}")

    if "offield" not in data:
        raise ValidationError(f"Input has no 'offield' field. Got {data}")

    pair.iffield = data["iffield"]
    pair.offield = data["offield"]

    db.session.add(pair)
    db.session.commit()
    return jsonify({})


@main.route("/pairs/<int:id>", methods=["GET"])
def pair(id) -> Response:
    return jsonify(Pair.query.get_or_404(id).export())
