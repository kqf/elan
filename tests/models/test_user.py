import pytest

from app.models.user import User


@pytest.fixture
def header(client, user):
    response = client.post("/tokens", auth=user, follow_redirects=True)
    token = response.json["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_retrieves_users(client, header):
    response = client.get("/users", headers=header, follow_redirects=True)
    assert response.json == {"users": ["http://localhost/users/1"]}
    assert response.status_code == 200


@pytest.mark.skip
def test_retrieves_a_user(client):
    response = client.get("/users/1", follow_redirects=True)
    expected = {"name": "john", "url": "http://localhost/users/1"}
    assert response.json == expected
    assert response.status_code == 200


@pytest.mark.skip
def test_creates_a_user(client):
    response = client.post("/users/", json={"name": "Bob", "password": "Lol"})
    assert response.json == {}
    assert response.status_code == 201

    # Check it does have an effect
    user = User.query.get(2)
    assert user.username == "Bob"
    assert user.verify_password("Lol")


@pytest.mark.skip
def test_updates_a_user(client):
    response = client.put("/users/1", json={"name": "Bob", "password": "Lol"})
    assert response.json == {}
    assert response.status_code == 200

    # Check it does have an effect
    user = User.query.get(1)
    assert user.username == "Bob"
    assert user.verify_password("Lol")


@pytest.mark.skip
def test_creates_a_lesson(client):
    User.register("bob", "lol")
    response = client.post(
        "/users/1/lessons",
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
