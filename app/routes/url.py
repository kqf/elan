from operator import attrgetter

from flask import url_for

from app import db


def url(route: str, model: db.Model, column="id") -> str:
    id_for = attrgetter(column)
    return url_for(route, id=id_for(model), _external=True)
