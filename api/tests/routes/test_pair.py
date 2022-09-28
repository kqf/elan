import pytest

from app.models import Pair


@pytest.fixture
def example(client):
    data = {
        "iffield": "la vache",
        "offield": "the cow",
    }
    response = client.post("/pairs/", json=data)
    assert response.json == {}
    assert response.status_code == 201
    yield data


@pytest.fixture
def new_example():
    return {
        "iffield": "une oiseau",
        "offield": "a bird",
    }


def test_retrieves_a_pair(client, example):
    response = client.get("/pairs/1", follow_redirects=True)
    # expected = b'{"name":"john","url":"http://localhost/pairs/1"}\n'
    assert response.json == example
    assert response.status_code == 200


def test_creates_a_pair(client, example, new_example):
    response = client.post("/pairs/", json=new_example)
    assert response.json == {}
    assert response.status_code == 201

    # Check it does have an effect
    pair: Pair = Pair.query.get(2)
    assert pair.iffield == new_example["iffield"]
    assert pair.offield == new_example["offield"]


def test_updates_a_pair(client, example, new_example):
    response = client.put("/pairs/1", json=new_example)
    assert response.json == {}
    assert response.status_code == 200

    # Check it does have an effect
    pair = Pair.query.get(1)
    assert pair.iffield == new_example["iffield"]
    assert pair.offield == new_example["offield"]
