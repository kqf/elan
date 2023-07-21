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


def test_the_practice(client, headers, example):
    # sourcery skip: extract-duplicate-method
    # Check the first pair
    response = client.get(
        "/practice/1",
        headers=headers,
        follow_redirects=True,
    )

    assert response.status_code == 200
    assert response.json == {
        "iffield": "la vache",
        "finished": False,
        "n_current": 1,
        "n_total": 2,
    }

    response = client.post(
        "/practice/1",
        headers=headers,
        follow_redirects=True,
        json={
            "offield": "the cow",
        },
    )
    assert response.json == {"matched": True}

    # Check the second pair (wrong response)
    response = client.get(
        "/practice/1",
        headers=headers,
        follow_redirects=True,
    )
    assert response.json == {
        "iffield": "le monde",
        "finished": False,
        "n_current": 2,
        "n_total": 2,
    }

    response = client.post(
        "/practice/1",
        headers=headers,
        follow_redirects=True,
        json={
            "offield": "xyz",
        },
    )
    assert response.json == {"matched": False}

    # Check the second pair (Correct response)
    response = client.get(
        "/practice/1",
        headers=headers,
        follow_redirects=True,
    )

    assert response.json == {
        "iffield": "le monde",
        "finished": False,
        "n_current": 2,
        "n_total": 2,
    }

    response = client.post(
        "/practice/1",
        headers=headers,
        follow_redirects=True,
        json={
            "offield": "the world",
        },
    )
    assert response.json == {"matched": True}

    # Check the finished lesson
    response = client.get(
        "/practice/1",
        headers=headers,
        follow_redirects=True,
    )
    # TODO: Handle the ill request

    print(response.json)

    assert response.json == {
        "iffield": "",
        "finished": True,
        "n_current": 3,
        "n_total": 2,
    }
