import json

import pytest

from app.models.pair import Pair


def to_response(data: dict) -> bytes:
    dumped = json.dumps(data, indent=None, separators=(",", ":"))
    return f"{dumped}\n".encode("utf-8")


@pytest.fixture
def example(client):
    data = {
        "iffield": "la vache",
        "offield": "the cow",
        "url": "http://localhost/pairs/1",
    }
    response = client.post("/pairs/", json=data)
    assert response.data == b"{}\n"
    assert response.status_code == 201
    yield data


def test_retrieves_a_user(client, example):
    response = client.get("/pairs/1", follow_redirects=True)
    # expected = b'{"name":"john","url":"http://localhost/pairs/1"}\n'
    assert response.data == to_response(example)
    assert response.status_code == 200


@pytest.mark.skip
def test_creates_a_user(client, example):
    response = client.post("/pairs/", json=example)
    assert response.data == b"{}\n"
    assert response.status_code == 201

    # Check it does have an effect
    pair = Pair.query.get(2)
    assert pair.username == "Bob"
    assert pair.verify_password("Lol")


@pytest.mark.skip
def test_updates_a_user(client):
    response = client.put("/pairs/1", json={"name": "Bob", "password": "Lol"})
    assert response.data == b"{}\n"
    assert response.status_code == 200

    # Check it does have an effect
    pair = Pair.query.get(1)
    assert pair.username == "Bob"
    assert pair.verify_password("Lol")
