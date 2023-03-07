from __future__ import annotations

from apifairy import response
from flask import Blueprint

from app.models import Genre
from app.schemes import GenreSchema

genres = Blueprint("genres", __name__)
genre_schema = GenreSchema()
genres_schema = GenreSchema(many=True)


@genres.route("/genres/<int:id>", methods=["GET"])
@response(genre_schema)
def genre(id) -> Genre:
    return Genre.query.get_or_404(id)


@genres.route("/lessons/", methods=["GET"])
@response(genres_schema)
def lessons_() -> Genre:
    return Genre.query.all()
