from __future__ import annotations

from apifairy import authenticate, body, response
from flask import Blueprint, request, url_for

from app import db, ma, token_auth
from app.models import Genre, Movie
from app.schemes import MovieSchema

movies = Blueprint("movies", __name__)
movie_schema = MovieSchema()
movies_schema = MovieSchema(many=True)


@movies.route("/movies/<int:id>", methods=["GET"])
@authenticate(token_auth)
@response(movie_schema)
def movie(id) -> Movie:
    return Movie.query.get_or_404(id)


@movies.route("/movies/", methods=["GET"])
@authenticate(token_auth)
@response(movies_schema)
def movies_() -> Movie:
    return Movie.query.all()


class InputMovieSchema(ma.Schema):
    title = ma.Str(required=True)


@movies.route("/movies/", methods=["POST"])
@authenticate(token_auth)
@response(movies_schema)
@body(InputMovieSchema)
def add_movie() -> tuple[dict, int, dict[str, str]]:
    genre = Genre.query.get_or_404(request.json["genre_id"])  # type: ignore
    specs = dict(request.json)  # type: ignore
    specs["genre_id"] = genre.id
    movie = Movie(**specs)
    db.session.add(movie)
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
