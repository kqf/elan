from flask_sqlalchemy import SQLAlchemy

from api.app.models import Genre, Movie


def create_movies(db: SQLAlchemy) -> None:
    genre1 = Genre(name="Action")
    genre2 = Genre(name="Comedy")
    genre3 = Genre(name="Drama")
    db.session.add_all([genre1, genre2, genre3])
    db.session.commit()

    # create some movies
    movie1 = Movie(
        title="Die Hard",
        genre_id=genre1.id,
        numberInStock=10,
        dailyRentalRate=2.99,
        publishDate="1988-07-15",
        liked=True,
    )
    movie2 = Movie(
        title="The Hangover",
        genre_id=genre2.id,
        numberInStock=7,
        dailyRentalRate=1.99,
        publishDate="2009-06-05",
        liked=False,
    )
    movie3 = Movie(
        title="The Godfather",
        genre_id=genre3.id,
        numberInStock=3,
        dailyRentalRate=3.99,
        publishDate="1972-03-24",
        liked=True,
    )
    db.session.add_all([movie1, movie2, movie3])
    db.session.commit()
