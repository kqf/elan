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

    pairs = [Pair(lesson_id=lesson.id, **p) for p in example_data]
    for p in pairs:
        db.session.add(p)
        db.session.commit()

    for user in users:
        user.lessons.append(lesson)
        db.session.commit()
    return pairs


def test_retrieves_a_lesson(client, example, headers):
    response = client.get("/lessons/1", headers=headers, follow_redirects=True)
    assert response.status_code == 200
    assert response.json == {"title": "lesson 1"}


def test_creates_a_lesson(client, headers):
    response = client.post(
        "/lessons/",
        headers=headers,
        json={
            "title": "lesson 1",
            "pairs": [
                {
                    "iffield": "la vache",
                    "offield": "the cow",
                },
                {
                    "iffield": "le monde",
                    "offield": "the world",
                },
            ],
        },
        follow_redirects=True,
    )
    # assert response.json == {}
    assert response.status_code == 201

    # Check it does have an effect
    user = User.query.get(1)
    lessons = list(user.lessons)
    assert len(lessons) == 1
    assert lessons[0].title == "lesson 1"
