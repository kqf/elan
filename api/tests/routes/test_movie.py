def test_retrieves_a_genre(client):
    response = client.get("/genres/1", follow_redirects=True)
    assert response.json == {"id": 1, "name": "Action"}
    assert response.status_code == 200


def test_retrieves_genres(client):
    response = client.get("/genres/", follow_redirects=True)
    assert len(response.json) == 5
    assert response.json[0] == {"id": 1, "name": "Action"}
    assert response.status_code == 200
