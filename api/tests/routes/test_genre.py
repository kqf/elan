import pytest


def test_retrieves_a_genre(client, genres):
    response = client.get("/genres/1", follow_redirects=True)
    assert response.json == {"id": 1, "name": "Action"}
    assert response.status_code == 200


def test_retrieves_genres(client, genres):
    response = client.get("/genres/", follow_redirects=True)
    assert len(response.json) == 8
    assert response.status_code == 200
