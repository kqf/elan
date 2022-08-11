from __future__ import annotations

from typing import Any

from flask import Response, jsonify, request, url_for
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from app import db, lm
from app.main import main
from app.models.exception import requires_fields
from app.models.lesson import Lesson
from app.models.pair import Pair


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), index=True, unique=True)
    password_hash = db.Column(db.String(64))
    tokens = db.relationship('Token', back_populates='user', lazy='noload')
    lessons = db.relationship("Lesson", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def register(username, password) -> User:
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

    def __repr__(self):
        return "<User {0}>".format(self.username)

    def url(self) -> str:
        return url_for("main.user", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "name": self.username,
            "url": self.url(),
        }

    def fromdict(self, data: dict[str, str] | Any) -> User:
        self.username = data["name"]
        self.set_password(data["password"])
        return self


@lm.user_loader
def load_user(id):  # sourcery skip: instance-method-first-arg-name
    return User.query.get(int(id))


@main.route("/users/", methods=["GET"])
def users() -> Response:
    return jsonify({"users": [u.url() for u in User.query.all()]})


@main.route("/users/<int:id>", methods=["GET"])
def user(id: int) -> Response:
    return jsonify(User.query.get_or_404(id).export())


@main.route("/users/", methods=["POST"])
@requires_fields("name", "password")
def create() -> tuple[Response, int, dict[str, str]]:
    user = User()
    user.fromdict(request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({}), 201, {"Location": user.url()}


@main.route("/users/<int:id>", methods=["PUT"])
@requires_fields("name", "password")
def update(id: int) -> Response:
    user = User.query.get_or_404(id)
    user.fromdict(request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({})


@main.route("/users/<int:id>/lessons/", methods=["GET"])
def users_lessons(id: int) -> Response:
    user = User.query.get_or_404(id)
    return jsonify(
        {"lessons": [lesson.url() for lesson in user.lessons.all()]}
    )


@main.route("/users/<int:id>/lessons/", methods=["POST"])
@requires_fields("pairs", "title")
def user_build_lesson(id: int) -> tuple[Response, int, dict[str, str]]:
    user = User.query.get_or_404(id)
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
