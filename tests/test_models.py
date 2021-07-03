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
    yield app
    db.drop_all()
    app_ctx.pop()


def test_password(app):
    u = User(username='bob')
    u.set_password('lol')
    assert u.verify_password('lol')
    assert not u.verify_password('rolf')


def test_registration(app):
    User.register('bob', 'lol')
    u = User.query.filter_by(username='bob').first()
    assert u is not None
    assert u.verify_password('lol')
    assert not u.verify_password('rolf')
