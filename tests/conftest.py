import pytest

from app import db
from app.config import build_app
from app.models.user import User


@pytest.fixture
def user():
    return "john", "cat"


@pytest.fixture
def app(user):
    app = build_app()
    app_ctx = app.app_context()
    app_ctx.push()
    db.create_all()
    User.register(*user)
    with app.test_request_context():
        yield app
    db.drop_all()
    app_ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client(use_cookies=True)
