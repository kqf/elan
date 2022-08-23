import pytest

import app.models.models as users
from app import db
from app.config import build_app


@pytest.fixture
def app():
    app = build_app()
    app_ctx = app.app_context()
    app_ctx.push()
    db.create_all()
    users.register(db, "john", "cat", email="john@example.com")
    yield app
    db.drop_all()
    app_ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client(use_cookies=True)


def test_login(app, client):
    r = client.get("/login")
    assert r.status_code == 200
    assert "<h1>Login</h1>" in r.get_data(as_text=True)

    r = client.post(
        "/login",
        data={"username": "john", "password": "cat"},
        follow_redirects=True,
    )
    assert r.status_code == 200
    assert "<h1>Login</h1>" in r.get_data(as_text=True)
