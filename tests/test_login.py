
import pytest

from app import db
from app.config import build_app
from app.models import User


@pytest.fixture
def context():
    app = build_app()
    app_ctx = app.app_context()
    app_ctx.push()
    client = app.test_client(use_cookies=True)
    db.create_all()
    User.register('john', 'cat')
    yield app, client
    db.drop_all()
    app_ctx.pop()


def test_login(context):
    app, client = context

    r = client.get('/login')
    assert r.status_code == 200
    assert '<h1>Login</h1>' in r.get_data(as_text=True)

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
    print(r.get_data())
