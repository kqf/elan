from app.models.user import User


def test_password():
    u = User(username="bob")
    u.set_password("lol")
    assert u.verify_password("lol")
    assert not u.verify_password("rolf")


def test_registration(client):
    User.register("bob", "lol")
    u = User.query.filter_by(username="bob").first()
    assert u is not None
    assert u.verify_password("lol")
    assert not u.verify_password("rolf")


def test_retrieves_users(client):
    response = client.get("/users", follow_redirects=True)
    assert response.data == b'{"users":["http://localhost/users/1"]}\n'
    assert response.status_code == 200


def test_retrieves_a_user(client):
    response = client.get("/users/1", follow_redirects=True)
    expected = b'{"name":"john","url":"http://localhost/users/1"}\n'
    assert response.data == expected
    assert response.status_code == 200


def test_creates_a_user(client):
    response = client.post("/users/", json={"name": "Bob", "password": "Lol"})
    assert response.data == b"{}\n"
    assert response.status_code == 201

    # Check it does have an effect
    user = User.query.get(2)
    assert user.username == "Bob"
    assert user.verify_password("Lol")


def test_updates_a_user(client):
    response = client.put("/users/1", json={"name": "Bob", "password": "Lol"})
    assert response.data == b"{}\n"
    assert response.status_code == 200

    # Check it does have an effect
    user = User.query.get(1)
    assert user.username == "Bob"
    assert user.verify_password("Lol")
