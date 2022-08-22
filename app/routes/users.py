from __future__ import annotations

from typing import Any

import sqlalchemy as sqla
from apifairy import authenticate
from flask import Response, jsonify, request

import app.models.user as users_
from app import db
from app.auth import basic_auth, token_auth
from app.main import main
from app.models.exception import requires_fields
from app.models.lesson import Lesson
from app.models.pair import Pair
from app.models.token import Token


@main.route("/users/", methods=["GET"])
@authenticate(token_auth)
def users() -> Response:
    return jsonify({"users": [u.url() for u in users_.User.query.all()]})


@main.route("/users/<int:id>", methods=["GET"])
@authenticate(token_auth)
def user(id: int) -> Response:
    return jsonify(users_.export(users_.User.query.get_or_404(id)))


@main.route("/users/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("username", "password", "email")
def create() -> tuple[Response, int, dict[str, str]]:
    user = users_.register(db, **request.json)  # type: ignore
    return jsonify({}), 201, {"Location": user.url()}


@main.route("/users/<int:id>", methods=["PUT"])
@authenticate(token_auth)
@requires_fields("username", "password", "email")
def update(id: int) -> Response:
    users_.edit(
        db, users_.User.query.get_or_404(id), **request.json
    )  # type: ignore
    return jsonify({})


@main.route("/users/<int:id>/lessons/", methods=["GET"])
@authenticate(token_auth)
def users_lessons(id: int) -> Response:
    user = users_.User.query.get_or_404(id)
    return jsonify(
        {"lessons": [lesson.url() for lesson in user.lessons.all()]}
    )


@main.route("/users/<int:id>/lessons/", methods=["POST"])
@authenticate(token_auth)
@requires_fields("pairs", "title")
def user_build_lesson(id: int) -> tuple[Response, int, dict[str, str]]:
    user = users_.User.query.get_or_404(id)
    data: dict[str, str | list[dict[str, str]]] | Any = request.json
    # First create the container
    lesson = Lesson(user=user, title=data["title"])
    db.session.add(lesson)
    db.session.commit()

    pairs: list[dict[str, str]] = data["pairs"]  # type: ignore
    # Then create the content
    for pdata in pairs:
        pair = Pair(lesson_id=lesson.id, **pdata)
        db.session.add(pair)
        db.session.commit()

    return jsonify({}), 201, {"Location": lesson.url()}


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
