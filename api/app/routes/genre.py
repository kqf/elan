from __future__ import annotations

from apifairy import response
from app.models import Genre
from app.schemes import GenreSchema
from flask import Blueprint

genres = Blueprint("genres", __name__)
genre_schema = GenreSchema()
genres_schema = GenreSchema(many=True)


@genres.route("/genres/<int:id>", methods=["GET"])
@response(genre_schema)
def genre(id) -> Genre:
    return Genre.query.get_or_404(id)


@genres.route("/genres/", methods=["GET"])
@response(genres_schema)
def genres_() -> Genre:
    return Genre.query.all()
