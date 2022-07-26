import pytest
from app.models import User


def test_password():
    u = User(username='bob')
    u.set_password('lol')
    assert u.verify_password('lol')
    assert not u.verify_password('rolf')


def test_registration(client):
    User.register('bob', 'lol')
    u = User.query.filter_by(username='bob').first()
    assert u is not None
    assert u.verify_password('lol')
    assert not u.verify_password('rolf')
