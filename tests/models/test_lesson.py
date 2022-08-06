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
    assert response.data == b"{}\n"
    assert response.status_code == 201
    yield data


@pytest.mark.skip
def test_retrieves_a_lesson(client, example):
    response = client.get("/lessons/1", follow_redirects=True)
    assert response.status_code == 200
