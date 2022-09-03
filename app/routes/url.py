from flask import url_for

from app import db


def url(route: str, model: db.Model) -> str:
    return url_for(route, id=model.id, _external=True)
