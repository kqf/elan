from __future__ import annotations

# from flask import Response, jsonify, request, url_for
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from app import db

# from app.main import main


class ValidationError(ValueError):
    ...


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    iffield = db.Column(db.String(), index=True)
    offield = db.Column(db.String(), index=True)
    __table_args__ = (
        db.UniqueConstraint('iffiled', 'offield'),
    )
