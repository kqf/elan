from apifairy import authenticate
from flask import current_app
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

from app.config import db
from app.main import main
from app.models.token import Token
from app.models.user import User

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(username, password):
    if username and password:
        user = db.session.scalar(User.select().filter_by(username=username))
        if user is None:
            user = db.session.scalar(User.select().filter_by(email=username))
        if user and user.verify_password(password):
            return user


@token_auth.verify_token
def verify_token(access_token):
    if current_app.config["DISABLE_AUTH"]:
        return db.session.get(User, 1)
    if access_token:
        return User.verify_access_token(access_token)


@main.route("/tokens", methods=["POST"])
@authenticate(basic_auth)
def new():
    user = basic_auth.current_user()
    token = user.generate_auth_token()
    db.session.add(token)
    Token.clean()  # keep token table clean of old tokens
    db.session.commit()
    return (
        {
            "access_token": token.access_token,
            "refresh_token": token.refresh_token,
        },
        200,
        {},
    )
