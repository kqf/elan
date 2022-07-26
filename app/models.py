from flask import jsonify
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from app import db, lm
from app.main import main


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

    def url(self):
        return "template"


@lm.user_loader
def load_user(id):  # sourcery skip: instance-method-first-arg-name
    return User.query.get(int(id))


@main.route("/users/", methods=["GET"])
def get_users():
    return jsonify({"users": [u.url() for u in User.query.all()]})
