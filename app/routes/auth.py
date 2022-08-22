from __future__ import annotations

import sqlalchemy as sqla
from apifairy import authenticate

import app.models.user as users_
from app import basic_auth, db, token_auth
from app.main import main
from app.models.token import Token


def generate_auth_token(user: users_.User) -> Token:
    token = Token(user=user)
    token.generate()
    return token


@main.route("/tokens", methods=["POST"])
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
            users_.User.query.filter(
                sqla.or_(
                    users_.User.username.like(username),
                    users_.User.email.like(username),
                )
            )
        )
        if user and users_.password_is_correct(user, password):
            return user


@token_auth.verify_token
def verify_token(access_token):
    if access_token:
        return users_.verify_access_token(db, access_token)
