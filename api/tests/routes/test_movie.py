import pytest


@pytest.fixture
def expected():
    return {
        "dailyRentalRate": 2.99,
        "genre": {
            "id": 1,
            "name": "Action",
        },
        "id": 1,
        "liked": True,
        "numberInStock": 10,
        "publishDate": "1988-07-15",
        "title": "Die Hard",
    }


def test_retrieves_a_movie(client, expected):
    response = client.get("/movies/1", follow_redirects=True)
    assert response.json == expected
    assert response.status_code == 200


def test_retrieves_movies(client, expected):
    response = client.get("/movies/", follow_redirects=True)
    assert len(response.json) == 8
    assert response.json[0] == expected
    assert response.status_code == 200
