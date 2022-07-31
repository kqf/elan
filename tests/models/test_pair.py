import pytest

from app.models.pair import Pair


@pytest.fixture
def example(client):
    data = {
        "iffield": "la vache",
        "offield": "the cow",
    }
    response = client.post("/pairs/", json=data)
    assert response.data == b"{}\n"
    assert response.status_code == 201
    yield data


def test_retrieves_a_user(client, example):
    response = client.get("/pairs/1", follow_redirects=True)
    # expected = b'{"name":"john","url":"http://localhost/pairs/1"}\n'
    # assert response.data == data
    assert response.status_code == 200


@pytest.mark.skip
def test_retrieves_users(client, example):
    response = client.get("/pairs", follow_redirects=True)
    assert response.data == b'{"pairs":["http://localhost/pairs/1"]}\n'
    assert response.status_code == 200


@pytest.mark.skip
def test_creates_a_user(client):
    response = client.post("/pairs/", json={"name": "Bob", "password": "Lol"})
    assert response.data == b"{}\n"
    assert response.status_code == 201

    # Check it does have an effect
    user = Pair.query.get(2)
    assert user.username == "Bob"
    assert user.verify_password("Lol")


@pytest.mark.skip
def test_updates_a_user(client):
    response = client.put("/pairs/1", json={"name": "Bob", "password": "Lol"})
    assert response.data == b"{}\n"
    assert response.status_code == 200

    # Check it does have an effect
    user = Pair.query.get(1)
    assert user.username == "Bob"
    assert user.verify_password("Lol")
