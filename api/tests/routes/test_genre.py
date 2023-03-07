import pytest


@pytest.fixture
def genres():
    return [
        {"id": 1, "name": "Action"},
        {"id": 2, "name": "Comedy"},
        {"id": 3, "name": "Drama"},
    ]


def test_retrieves_a_genre(client, genres):
    for i, genre in enumerate(genres):
        response = client.get(f"/genres/{i + 1}", follow_redirects=True)
        assert response.json == genre
        assert response.status_code == 200


def test_retrieves_genres(client):
    response = client.get("/genres/", follow_redirects=True)
    print(response.json)
    # assert response.json == {"id": 1, "name": "Action"}
    assert response.status_code == 200
