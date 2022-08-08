from __future__ import annotations

from typing import Any

from flask import Response, jsonify, request, url_for
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from app import db, lm
from app.main import main
from app.models.exception import requires_fields


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), index=True, unique=True)
    password_hash = db.Column(db.String(64))
    orders = db.relationship("Lesson", backref="user", lazy="dynamic")

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


@main.route("/customers/<int:id>/orders/", methods=["GET"])
def users_lessons(id: int) -> Response:
    user = User.query.get_or_404(id)
    return jsonify({"orders": [lesson.url() for lesson in user.lessons.all()]})
