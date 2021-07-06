
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
    yield app
    db.drop_all()
    app_ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client(use_cookies=True)


def test_index(app, client):
    with client:
        r = client.post(
            '/login',
            data={
                'username': 'john',
                'password': 'cat'
            },
            follow_redirects=True
        )
        assert r.status_code == 200
        assert '<h1>Login</h1>' in r.get_data(as_text=True)

        r = client.get('/', follow_redirects=True)
        assert r.status_code == 200
        assert '<h1>Login</h1>' in r.get_data(as_text=True)
        print(r.get_data(as_text=True))
