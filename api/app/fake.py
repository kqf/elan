import itertools

from flask_sqlalchemy import SQLAlchemy

from app.models import Lesson, Movie, Pair, User

_movies = [
    {
        "title": "Die Hard",
        "numberInStock": 10,
        "dailyRentalRate": 2.99,
        "publishDate": "1988-07-15",
        "liked": True,
    },
    {
        "title": "The Hangover",
        "numberInStock": 7,
        "dailyRentalRate": 1.99,
        "publishDate": "2009-06-05",
        "liked": False,
    },
    {
        "title": "The Godfather",
        "numberInStock": 3,
        "dailyRentalRate": 3.99,
        "publishDate": "1972-03-24",
        "liked": True,
    },
    {
        "title": "The Shawshank Redemption",
        "numberInStock": 5,
        "dailyRentalRate": 2.50,
        "publishDate": "1994-09-23",
        "liked": True,
    },
    {
        "title": "The Dark Knight",
        "numberInStock": 3,
        "dailyRentalRate": 3.00,
        "publishDate": "2008-07-18",
        "liked": True,
    },
    {
        "title": "Forrest Gump",
        "numberInStock": 8,
        "dailyRentalRate": 1.99,
        "publishDate": "1994-07-06",
        "liked": False,
    },
    {
        "title": "Jurassic Park",
        "numberInStock": 2,
        "dailyRentalRate": 2.50,
        "publishDate": "1993-06-11",
        "liked": True,
    },
    {
        "title": "Pulp Fiction",
        "numberInStock": 4,
        "dailyRentalRate": 2.25,
        "publishDate": "1994-10-14",
        "liked": False,
    },
]


def create_movies(db: SQLAlchemy) -> None:
    def to_movie(movie):
        model = {k: v for k, v in movie.items() if k != "genre"}
        return model

    # create some movies
    movies = [Movie(**to_movie(movie)) for movie in _movies]
    db.session.add_all(movies)
    db.session.commit()


def create_lessons(db: SQLAlchemy) -> None:
    names = [f"Lesson {i}" for i in range(24)]
    lessons = [
        Lesson(
            title=name,
            level=f"B {i % 3 + 1}",
            topic=f"Topic {i % 4 + 1}",
        )
        for i, name in enumerate(names)
    ]
    db.session.add_all(lessons)
    db.session.commit()

    for user in User.query.all():
        user.lessons.extend(lessons)
        db.session.commit()

    for (i, lesson), j in itertools.product(enumerate(lessons), range(10)):
        pair = Pair(
            iffield=f"Pair {j} from leson{i}. Answer is 'test'",
            offield="test",
        )
        lesson.pairs.append(pair)
        db.session.commit()
