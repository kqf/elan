from __future__ import annotations

from typing import Any

from flask import Response, jsonify, request

from app import db
from app.main import main
from app.models.exception import requires_fields
from app.models.pair import Pair


@main.route("/pairs/", methods=["POST"])
@requires_fields("iffield", "offield")
def create_pair() -> tuple[Response, int, dict[str, str]]:
    data: dict[str, str] | Any = request.json
    pair = Pair(iffield=data["iffield"], offield=data["offield"])
    db.session.add(pair)
    db.session.commit()
    return jsonify({}), 201, {"Location": pair.url()}


@main.route("/pairs/<int:id>", methods=["PUT"])
@requires_fields("iffield", "offield")
def update_pair(id: int) -> Response:
    pair: Pair = Pair.query.get_or_404(id)

    data: dict[str, str] | Any = request.json
    pair.iffield = data["iffield"]
    pair.offield = data["offield"]

    db.session.add(pair)
    db.session.commit()
    return jsonify({})


@main.route("/pairs/<int:id>", methods=["GET"])
def pair(id) -> Response:
    return jsonify(Pair.query.get_or_404(id).export())
