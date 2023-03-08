from app.models import Genre, Movie
from flask_sqlalchemy import SQLAlchemy

movies = [
    {
        "title": "Die Hard",
        "genre": "Action",
        "numberInStock": 10,
        "dailyRentalRate": 2.99,
        "publishDate": "1988-07-15",
        "liked": True,
    },
    {
        "title": "The Hangover",
        "genre": "Comedy",
        "numberInStock": 7,
        "dailyRentalRate": 1.99,
        "publishDate": "2009-06-05",
        "liked": False,
    },
    {
        "title": "The Godfather",
        "genre": "Drama",
        "numberInStock": 3,
        "dailyRentalRate": 3.99,
        "publishDate": "1972-03-24",
        "liked": True,
    },
    {
        "title": "The Shawshank Redemption",
        "genre": "Drama",
        "numberInStock": 5,
        "dailyRentalRate": 2.50,
        "publishDate": "1994-09-23",
        "liked": True,
    },
    {
        "title": "The Dark Knight",
        "genre": "Action",
        "numberInStock": 3,
        "dailyRentalRate": 3.00,
        "publishDate": "2008-07-18",
        "liked": True,
    },
    {
        "title": "Forrest Gump",
        "genre": "Drama",
        "numberInStock": 8,
        "dailyRentalRate": 1.99,
        "publishDate": "1994-07-06",
        "liked": False,
    },
    {
        "title": "Jurassic Park",
        "genre": "Sci-Fi",
        "numberInStock": 2,
        "dailyRentalRate": 2.50,
        "publishDate": "1993-06-11",
        "liked": True,
    },
    {
        "title": "Pulp Fiction",
        "genre": "Crime",
        "numberInStock": 4,
        "dailyRentalRate": 2.25,
        "publishDate": "1994-10-14",
        "liked": False,
    },
]


def create_movies(db: SQLAlchemy) -> None:
    genres = {movie["genre"]: Genre(name=["genre"]) for movie in movies}
    db.session.add_all(genres.values())
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
