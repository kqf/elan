import json

import pytest

from app.models.models import Pair


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


@pytest.fixture
def new_example():
    return {
        "iffield": "une oiseau",
        "offield": "a bird",
        "url": "http://localhost/pairs/2",
    }


def test_retrieves_a_pair(client, example):
    response = client.get("/pairs/1", follow_redirects=True)
    # expected = b'{"name":"john","url":"http://localhost/pairs/1"}\n'
    assert response.data == to_response(example)
    assert response.status_code == 200


def test_creates_a_pair(client, example, new_example):
    response = client.post("/pairs/", json=new_example)
    assert response.data == b"{}\n"
    assert response.status_code == 201

    # Check it does have an effect
    pair: Pair = Pair.query.get(2)
    assert pair.iffield == new_example["iffield"]
    assert pair.offield == new_example["offield"]


def test_updates_a_pair(client, example, new_example):
    response = client.put("/pairs/1", json=new_example)
    assert response.data == b"{}\n"
    assert response.status_code == 200

    # Check it does have an effect
    pair = Pair.query.get(1)
    assert pair.iffield == new_example["iffield"]
    assert pair.offield == new_example["offield"]
