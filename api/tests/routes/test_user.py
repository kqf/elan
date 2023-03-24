import app.models as users


def test_retrieves_users(client, headers):
    response = client.get("/users", headers=headers, follow_redirects=True)
    assert response.json == [
        {"email": "john@example.com", "id": 1, "username": "john"}
    ]
    assert response.status_code == 200


def test_retrieves_a_user(client, headers):
    response = client.get("/users/1", headers=headers, follow_redirects=True)
    expected = {"email": "john@example.com", "id": 1, "username": "john"}
    assert response.json == expected
    assert response.status_code == 200


def test_creates_a_user(client, headers):
    response = client.post(
        "/users/",
        headers=headers,
        json={
            "username": "Bob",
            "password": "Lol",
            "email": "bob@example.com",
        },
    )
    assert response.json == {}
    assert response.status_code == 201

    # Check it does have an effect
    user = users.User.query.get(2)
    assert user.username == "Bob"
    assert users.password_is_correct(user, "Lol")


def test_updates_a_user(client, headers):
    response = client.put(
        "/users/1",
        headers=headers,
        json={
            "username": "Bob",
            "password": "Lol",
            "email": "bob@example.com",
        },
    )
    assert response.json == {}
    assert response.status_code == 200

    # Check it does have an effect
    user = users.User.query.get(1)
    assert user.username == "Bob"
    assert users.password_is_correct(user, "Lol")
