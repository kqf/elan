import pytest


@pytest.fixture
def example(client):
    data = {
        "title,": "lesson 1",
        "url": "http://localhost/lessons/1",
    }
    response = client.post("/lessons/", json=data)
    assert response.data == b"{}\n"
    assert response.status_code == 201
    yield data


def test_retrieves_a_lesson(client, example):
    response = client.get("/lessons/1", follow_redirects=True)
    # assert response.data == to_response(example)
    assert response.status_code == 200
