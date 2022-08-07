import pytest

from app.models.lesson import Lesson  # noqa


@pytest.fixture
def example(client):
    data = {
        "title": "lesson 1",
        "url": "http://localhost/lessons/1",
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
    }
    response = client.post("/lessons/", json=data)
    assert response.json == {}
    assert response.status_code == 201
    yield data


def test_retrieves_a_lesson(client, example):
    response = client.get("/lessons/1", follow_redirects=True)
    assert response.status_code == 200


def test_retrieves_lesson_data(client, example):
    response = client.get("/lessons/1/data", follow_redirects=True)
    assert response.json == [
        "http://localhost/pairs/1",
        "http://localhost/pairs/2",
    ]
