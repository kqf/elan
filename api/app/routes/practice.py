from __future__ import annotations

from apifairy import authenticate, response
from flask import Blueprint

from app import db, ma, token_auth
from app.models import User

practice = Blueprint("practice", __name__)


class PracticeInput(ma.Schema):
    iffield = ma.Str(required=True)


@practice.route("/practice/<int:id>/", methods=["GET"])
@authenticate(token_auth)
@response(PracticeInput)
def practice_start(id: int) -> User:
    user = token_auth.current_user()
    current = user.active_lesson
    if current is None or current.id != id:
        current = PracticeLesson(
            lesson=user.lessons[id],
        )
        user.active_lesson = current
        db.session.add(user.active_lesson)
        db.session.commit()

    return user.lessons[current.lesson_id].pairs[current.pair_id].iffield
