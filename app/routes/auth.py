from __future__ import annotations

import sqlalchemy as sqla
from apifairy import authenticate
from flask import Blueprint

from app import basic_auth, db, token_auth
from app.models import Token, User, password_is_correct, verify_access_token

auths = Blueprint("auths", __name__)


def generate_auth_token(user: User) -> Token:
    token = Token(user=user)
    token.generate()
    return token


@auths.route("/tokens", methods=["POST"])
@authenticate(basic_auth)
def new():
    token = generate_auth_token(basic_auth.current_user())
    db.session.add(token)
    db.session.commit()
    # Token.clean()  # keep token table clean of old tokens
    return (
        {
            "token": token.token,
        },
        200,
        {},
    )


@basic_auth.verify_password
def verify_password(username, password):
    if username and password:
        user = db.session.scalar(
            User.query.filter(
                sqla.or_(
                    User.username.like(username),
                    User.email.like(username),
                )
            )
        )
        if user and password_is_correct(user, password):
            return user


@token_auth.verify_token
def verify_token(access_token):
    if access_token:
        return verify_access_token(db, access_token)
