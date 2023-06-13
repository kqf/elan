import pytest

from app import db
from app.models import Lesson, Pair, User


@pytest.fixture
def example_data():
    return [
        {
            "iffield": "la vache",
            "offield": "the cow",
        },
        {
            "iffield": "le monde",
            "offield": "the world",
        },
    ]


@pytest.fixture
def example(client, example_data):
    users = User.query.all()
    lesson = Lesson(title="lesson 1")
    db.session.add(lesson)
    db.session.commit()

    pairs = [Pair(**p) for p in example_data]
    for p in pairs:
        db.session.add(p)
        lesson.pairs.append(p)
        db.session.commit()

    for user in users:
        user.lessons.append(lesson)
        db.session.commit()
    return pairs


def test_retrieves_users(client, headers, example):
    response = client.get(
        "/practice/0",
        headers=headers,
        follow_redirects=True,
    )
    assert response.status_code == 200
