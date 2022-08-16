import pytest

from app.models.user import User


@pytest.fixture
def headers(client, user):
    response = client.post("/tokens", auth=user, follow_redirects=True)
    token = response.json["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_retrieves_users(client, headers):
    response = client.get("/users", headers=headers, follow_redirects=True)
    assert response.json == {"users": ["http://localhost/users/1"]}
    assert response.status_code == 200


def test_retrieves_a_user(client, headers):
    response = client.get("/users/1", headers=headers, follow_redirects=True)
    expected = {"name": "john", "url": "http://localhost/users/1"}
    assert response.json == expected
    assert response.status_code == 200


def test_creates_a_user(client, headers):
    response = client.post(
        "/users/", headers=headers, json={"name": "Bob", "password": "Lol"}
    )
    assert response.json == {}
    assert response.status_code == 201

    # Check it does have an effect
    user = User.query.get(2)
    assert user.username == "Bob"
    assert user.verify_password("Lol")


def test_updates_a_user(client, headers):
    response = client.put(
        "/users/1", headers=headers, json={"name": "Bob", "password": "Lol"}
    )
    assert response.json == {}
    assert response.status_code == 200

    # Check it does have an effect
    user = User.query.get(1)
    assert user.username == "Bob"
    assert user.verify_password("Lol")


def test_creates_a_lesson(client, headers):
    response = client.post(
        "/users/1/lessons",
        headers=headers,
        json={
            "title": "lesson 1",
            "pairs": [
                {
                    "iffield": "la vache",
                    "offield": "the cow",
                },
                {
                    "iffield": "le monde",
                    "offield": "the world",
                },
            ],
        },
        follow_redirects=True,
    )
    # assert response.json == {}
    assert response.status_code == 201

    # Check it does have an effect
    user = User.query.get(1)
    lessons = list(user.lessons.all())
    assert len(lessons) == 1
    assert lessons[0].title == "lesson 1"
