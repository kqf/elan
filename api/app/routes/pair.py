from __future__ import annotations

from typing import Any

from apifairy import body, response
from flask import Blueprint, request, url_for

from app import db, ma
from app.models import Pair
from app.routes.exception import requires_fields
from app.schemes import PairSchema

pairs = Blueprint("pairs", __name__)
pair_schema = PairSchema()


class PairFields(ma.Schema):
    iffield = ma.Str(required=True)
    offield = ma.Str(required=True)


@pairs.route("/pairs/", methods=["POST"])
@body(PairFields)
def create_pair(data) -> tuple[dict, int, dict[str, str]]:
    pair = Pair(iffield=data["iffield"], offield=data["offield"])
    db.session.add(pair)
    db.session.commit()
    return (
        {},
        201,
        {"Location": url_for("pairs.pair", id=pair.id, follow_redirects=True)},
    )


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
