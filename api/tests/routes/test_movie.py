def test_retrieves_a_movie(client):
    response = client.get("/movies/1", follow_redirects=True)
    assert response.json == {"id": 1, "name": "Action"}
    assert response.status_code == 200


def test_retrieves_movies(client):
    response = client.get("/movies/", follow_redirects=True)
    assert len(response.json) == 5
    assert response.json[0] == {"id": 1, "name": "Action"}
    assert response.status_code == 200
