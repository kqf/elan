import pytest

import app.models.user as users
from app import db
from app.config import build_app


@pytest.fixture
def user():
    return "john", "cat"


@pytest.fixture
def app(user):
    app = build_app()
    app_ctx = app.app_context()
    app_ctx.push()
    db.create_all()
    users.register(db, *user, email="john@example.com")
    with app.test_request_context():
        yield app
    db.drop_all()
    app_ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client(use_cookies=True)
