import itertools

from flask_sqlalchemy import SQLAlchemy

from app.models import Genre, Lesson, Movie, Pair, User

_movies = [
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
    unique_genres: set[str] = {str(movie["genre"]) for movie in _movies}
    genres = {genre: Genre(name=genre) for genre in sorted(unique_genres)}
    db.session.add_all(genres.values())
    db.session.commit()

    def to_movie(movie):
        model = {k: v for k, v in movie.items() if k != "genre"}
        model["genre_id"] = genres[movie["genre"]].id
        return model

    # create some movies
    movies = [Movie(**to_movie(movie)) for movie in _movies]
    db.session.add_all(movies)
    db.session.commit()


def create_lessons(db: SQLAlchemy) -> None:
    names = [
        "Lesson 1",
        "Lesson 2",
        "Lesson 3",
    ]
    lessons = [Lesson(title=name) for name in names]
    db.session.add_all(lessons)
    db.session.commit()

    for user in User.query.all():
        user.lessons.extend(lessons)
        db.session.commit()

    for (i, lesson), j in itertools.product(enumerate(lessons), range(10)):
        pair = Pair(iffield=f"Pair {j} from leson{i}", offield="test")
        lesson.pairs.append(pair)
        db.session.commit()
