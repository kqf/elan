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


def test_retrieves_a_lesson(client, example, headers, example_data):
    response = client.get("/lessons/1", headers=headers, follow_redirects=True)
    assert response.status_code == 200
    assert response.json == {
        "id": 1,
        "pairs": example_data,
        "title": "lesson 1",
        "level": None,
        "topic": None,
    }


def test_creates_a_lesson(client, example, headers, example_data):
    response = client.post(
        "/lessons/",
        headers=headers,
        follow_redirects=True,
        json={
            "title": "Fake created lesson",
            "level": "B1",
            "topic": "Something",
            "pairs": [
                {
                    "iffield": "a",
                    "offield": "z",
                },
                {
                    "iffield": "b",
                    "offield": "x",
                },
            ],
        },
    )
    assert response.status_code == 201
    # assert response.json == {}
