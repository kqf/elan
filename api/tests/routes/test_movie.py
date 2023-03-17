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


def test_retrieves_a_movie(client, expected, headers):
    response = client.get("/movies/1", headers=headers, follow_redirects=True)
    assert response.json == expected
    assert response.status_code == 200


def test_retrieves_movies(client, expected, headers):
    response = client.get("/movies/", headers=headers, follow_redirects=True)
    assert len(response.json) == 8
    assert response.json[0] == expected
    assert response.status_code == 200


def test_adds_a_movie(client, expected, headers):
    before = client.get(
        "/movies/",
        headers=headers,
        follow_redirects=True,
    ).json
    assert len(before) == 8
    data = {
        "title": "A fake title",
        "genre_id": 1,
        "numberInStock": 1,
        "dailyRentalRate": 2,
        "publishDate": "unknown",
        "liked": False,
    }
    response = client.post(
        "/movies/",
        headers=headers,
        json=data,
        follow_redirects=True,
    )
    assert response.status_code == 201
    after = client.get(
        "/movies/",
        headers=headers,
        follow_redirects=True,
    ).json
    assert len(after) == 9
