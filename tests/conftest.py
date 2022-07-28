
import pytest

from app import db
from app.config import build_app
from app.models import User


@pytest.fixture
def app():
    app = build_app()
    app_ctx = app.app_context()
    app_ctx.push()
    db.create_all()
    User.register('john', 'cat')
    with app.test_request_context():
        yield app
    db.drop_all()
    app_ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client(use_cookies=True)
