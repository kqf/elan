from __future__ import annotations

from apifairy import response
from flask import Blueprint, request, url_for

from app import db
from app.models import Genre, Movie
from app.routes.exception import requires_fields
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


@movies.route("/movies/", methods=["GET"])
@response(movies_schema)
@requires_fields(
    "title",
    "genre_id",
    "numberInStock",
    "dailyRentalRate",
    "publishDate",
    "like",
)
def add_movie() -> tuple[dict, int, dict[str, str]]:
    genre = Genre.query.get_or_404(request.json["genre_id"])  # type: ignore
    specs = dict(request.json)  # type: ignore
    specs["genre_id"] = genre.id
    movie = Movie(**specs)
    db.session.add_all(movies)
    db.session.commit()

    return (
        {},
        201,
        {
            "Location": url_for(
                "pairs.pair", id=movie.id, follow_redirects=True
            )
        },
    )
