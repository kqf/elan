
import pytest
import flask_login

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


@pytest.fixture
def test_user(app):
    return User.query.filter_by(username='john').first()


@pytest.fixture
def logged_in_user(request, test_user):
    flask_login.login_user(test_user)
    request.addfinalizer(flask_login.logout_user)


def test_index(app, client, logged_in_user):
    r = client.get('/', follow_redirects=True)
    print(r.get_data(as_text=True))
