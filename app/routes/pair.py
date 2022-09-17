from __future__ import annotations

from typing import Any

from apifairy import response
from flask import Blueprint, Response, request

from app import db
from app.models import Pair
from app.routes.exception import requires_fields
from app.routes.url import url
from app.schemes import PairSchema

pairs = Blueprint("pairs", __name__)
pair_schema = PairSchema()


@pairs.route("/pairs/", methods=["POST"])
@requires_fields("iffield", "offield")
def create_pair() -> tuple[dict, int, dict[str, str]]:
    data: dict[str, str] | Any = request.json
    pair = Pair(iffield=data["iffield"], offield=data["offield"])
    db.session.add(pair)
    db.session.commit()
    return {}, 201, {"Location": url("pairs.pair", pair)}


@pairs.route("/pairs/<int:id>", methods=["PUT"])
@requires_fields("iffield", "offield")
def update_pair(id: int) -> dict:
    pair: Pair = Pair.query.get_or_404(id)

    data: dict[str, str] | Any = request.json
    pair.iffield = data["iffield"]
    pair.offield = data["offield"]

    db.session.add(pair)
    db.session.commit()
    return {}


@pairs.route("/pairs/<int:id>", methods=["GET"])
@response(pair_schema)
def pair(id) -> Pair:
    return Pair.query.get_or_404(id)
