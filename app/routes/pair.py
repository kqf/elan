from __future__ import annotations

from typing import Any

from flask import Blueprint, Response, jsonify, request

from app import db
from app.models.models import Pair
from app.routes.exception import requires_fields
from app.routes.url import url

pairs = Blueprint("pairs", __name__)


@pairs.route("/pairs/", methods=["POST"])
@requires_fields("iffield", "offield")
def create_pair() -> tuple[Response, int, dict[str, str]]:
    data: dict[str, str] | Any = request.json
    pair = Pair(iffield=data["iffield"], offield=data["offield"])
    db.session.add(pair)
    db.session.commit()
    return jsonify({}), 201, {"Location": url("pairs.pair", pair)}


@pairs.route("/pairs/<int:id>", methods=["PUT"])
@requires_fields("iffield", "offield")
def update_pair(id: int) -> Response:
    pair: Pair = Pair.query.get_or_404(id)

    data: dict[str, str] | Any = request.json
    pair.iffield = data["iffield"]
    pair.offield = data["offield"]

    db.session.add(pair)
    db.session.commit()
    return jsonify({})


@pairs.route("/pairs/<int:id>", methods=["GET"])
def pair(id) -> Response:
    pair = Pair.query.get_or_404(id)
    metadata = pair.export()
    metadata["url"] = url("pairs.pair", pair)
    return jsonify(metadata)
