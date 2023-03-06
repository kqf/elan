def test_retrieves_a_genre(client):
    response = client.get("/genres/1", follow_redirects=True)
    assert response.json == {"id": 1, "name": "Action"}
    # expected = b'{"name":"john","url":"http://localhost/pairs/1"}\n'
    assert response.status_code == 200
