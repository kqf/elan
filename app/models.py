from __future__ import annotations

from flask import jsonify
from flask_login import UserMixin
from traitlets import ValidateHandler
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
    def register(username, password):
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

    def __repr__(self):
        return '<User {0}>'.format(self.username)

    def url(self) -> str:
        return "template"

    def export(self) -> dict[str, str]:
        return {
            "name": self.username,
            "url": self.url(),
        }

    def fromdict(self, data: dict[str, str]) -> User:
        if "name" not in data:
            raise ValidationError(f"Input has no 'name' field. Got {data}")

        self.name = data["name"]
        return self


@lm.user_loader
def load_user(id):  # sourcery skip: instance-method-first-arg-name
    return User.query.get(int(id))


@main.route("/users/", methods=["GET"])
def get_users():
    return jsonify({"users": [u.url() for u in User.query.all()]})
