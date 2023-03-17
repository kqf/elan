import pytest

from app import db, models
from app.config import build_app
from app.fake import create_movies


@pytest.fixture
def user():
    return "john", "cat"


@pytest.fixture
def headers(client, user):
    response = client.post("/tokens", auth=user, follow_redirects=True)
    token = response.json["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def app(user):
    app = build_app()
    app_ctx = app.app_context()
    app_ctx.push()
    db.drop_all()
    db.create_all()
    models.register_user(db, *user, email="john@example.com")
    create_movies(db)
    with app.test_request_context():
        yield app
    db.drop_all()
    app_ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client(use_cookies=True)
