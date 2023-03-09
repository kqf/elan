from __future__ import annotations

from apifairy import response
from flask import Blueprint

from app.models import Movie
from app.schemes import MovieSchema

movies = Blueprint("movies", __name__)
movie_schema = MovieSchema()
movies_schema = MovieSchema(many=True)


@movies.route("/movies/<int:id>", methods=["GET"])
@response(movie_schema)
def movie(id) -> Movie:
    return Movie.query.get_or_404(id)


@movies.route("/movies/", methods=["GET"])
@response(movies_schema)
def movies_() -> Movie:
    return Movie.query.all()
