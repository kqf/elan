import itertools

from flask_sqlalchemy import SQLAlchemy

from app.models import Lesson, Pair, User


def create_movies(db: SQLAlchemy) -> None:
    pass


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
