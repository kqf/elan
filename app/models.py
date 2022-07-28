from __future__ import annotations
from crypt import methods
from typing import Any, Optional

from flask import Response, jsonify, request, url_for
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from app import db, lm
from app.main import main


class ValidationError(ValueError):
    ...


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(16), index=True, unique=True)
    password_hash = db.Column(db.String(64))

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
        return '<User {0}>'.format(self.username)

    def url(self) -> str:
        return url_for("main.user", id=self.id, _external=True)

    def export(self) -> dict[str, str]:
        return {
            "name": self.username,
            "url": self.url(),
        }

    def fromdict(self, data: Optional[Any]) -> User:
        if "name" not in data:
            raise ValidationError(f"Input has no 'name' field. Got {data}")

        if "password" not in data:
            raise ValidationError(f"Input has no 'password' field. Got {data}")

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
def create() -> tuple[Response, int, dict[str, str]]:
    user = User()
    user.fromdict(request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({}), 201, {"Location": user.url()}


@main.route("/users/<int:id>", methods=["PUT"])
def update(id: int) -> Response:
    user = User.query.get_or_404(id)
    user.fromdict(request.json)
    db.session.add(user)
    db.session.commit()
    return jsonify({})
