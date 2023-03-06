from __future__ import annotations

from apifairy import response
from flask import Blueprint

from app.models import Genre
from app.schemes import GenreSchema

genres = Blueprint("Genres", __name__)
genre_schema = GenreSchema()


@genres.route("/Genres/<int:id>", methods=["GET"])
@response(genre_schema)
def genre(id) -> Genre:
    return Genre.query.get_or_404(id)
