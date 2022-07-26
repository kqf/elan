
import pytest
import flask_login

from app.models import User


@pytest.fixture
def test_user():
    return User.query.filter_by(username='john').first()


@pytest.fixture
def logged_in_user(request, test_user):
    flask_login.login_user(test_user)
    request.addfinalizer(flask_login.logout_user)


def test_index(client, logged_in_user):
    r = client.get('/', follow_redirects=True)
    print(r.get_data(as_text=True))
