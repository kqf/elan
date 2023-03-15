from __future__ import annotations

from logging import getLogger

import sqlalchemy as sqla
from apifairy import authenticate
from flask import Blueprint

from app import basic_auth, db, token_auth
from app.models import (
    Token,
    User,
    generate_auth_token,
    password_is_correct,
    verify_access_token,
)

auths = Blueprint("auths", __name__)


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


@auths.route("/login", methods=["GET"])
@authenticate(basic_auth)
def login():
    user = basic_auth.current_user()
    token = db.session.scalar(Token.query.filter_by(user=user))
    getLogger().error("test ~>")
    # Token.clean()  # keep token table clean of old tokens
    return {
        "token": token.token,
    }


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
    getLogger().error("Token ~> %s", access_token)
    if access_token:
        return verify_access_token(db, access_token)
