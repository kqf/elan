import pytest

from app import db
from app.models.models import Lesson  # noqa
from app.models.pair import Pair


@pytest.fixture
def example(client):
    lesson = Lesson(title="lesson 1")
    data = [
        {
            "iffield": "la vache",
            "offield": "the cow",
        },
        {
            "iffield": "le monde",
            "offield": "the world",
        },
    ]
    db.session.add(lesson)
    db.session.commit()

    pairs = [Pair(lesson_id=lesson.id, **p) for p in data]
    for p in pairs:
        db.session.add(p)
        db.session.commit()
    return pairs


def test_retrieves_a_lesson(client, example):
    response = client.get("/lessons/1", follow_redirects=True)
    assert response.status_code == 200


@pytest.mark.skip
def test_retrieves_lesson_data(client, example):
    response = client.get("/lessons/1/data", follow_redirects=True)
    assert response.json == [
        "http://localhost/pairs/1",
        "http://localhost/pairs/2",
    ]
