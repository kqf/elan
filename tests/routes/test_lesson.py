import pytest

from app import db
from app.models import Lesson, Pair


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
    lesson = Lesson(title="lesson 1")
    db.session.add(lesson)
    db.session.commit()

    pairs = [Pair(lesson_id=lesson.id, **p) for p in example_data]
    for p in pairs:
        db.session.add(p)
        db.session.commit()
    return pairs


def test_retrieves_a_lesson(client, example):
    response = client.get("/lessons/1", follow_redirects=True)
    assert response.status_code == 200
    assert response.json == {"title": "lesson 1"}


@pytest.mark.skip
def test_retrieves_lesson_data(client, example, example_data):
    response = client.get("/lessons/1/data", follow_redirects=True)
    assert response.json == example_data
