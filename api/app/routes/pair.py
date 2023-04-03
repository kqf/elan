from __future__ import annotations

from typing import Any

from apifairy import body, response
from flask import Blueprint, url_for

from app import db, ma
from app.models import Pair
from app.schemes import PairSchema

pairs = Blueprint("pairs", __name__)
pair_schema = PairSchema()


class PairInputs(ma.Schema):
    iffield = ma.Str(required=True)
    offield = ma.Str(required=True)


@pairs.route("/pairs/", methods=["POST"])
@body(PairInputs)
def create_pair(data: dict[str, Any]) -> tuple[dict, int, dict[str, str]]:
    pair = Pair(iffield=data["iffield"], offield=data["offield"])
    db.session.add(pair)
    db.session.commit()
    return (
        {},
        201,
        {"Location": url_for("pairs.pair", id=pair.id, follow_redirects=True)},
    )


@pairs.route("/pairs/<int:id>", methods=["PUT"])
@body(PairInputs)
def update_pair(id: int, data: dict[str, Any]) -> dict:
    pair: Pair = Pair.query.get_or_404(id)
    pair.iffield = data["iffield"]
    pair.offield = data["offield"]

    db.session.add(pair)
    db.session.commit()
    return {}


@pairs.route("/pairs/<int:id>", methods=["GET"])
@response(pair_schema)
def pair(id) -> Pair:
    return Pair.query.get_or_404(id)
