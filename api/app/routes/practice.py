from __future__ import annotations

from apifairy import authenticate, response
from flask import Blueprint

from app import db, ma, token_auth
from app.models import PracticeLesson

practice = Blueprint("practice", __name__)


class PracticeInput(ma.Schema):
    iffield = ma.Str(required=True)


@practice.route("/practice/<int:id>/", methods=["GET"])
@authenticate(token_auth)
@response(PracticeInput)
def practice_start(id: int) -> dict[str, str]:
    user = token_auth.current_user()
    current = user.practice_lesson
    if current is None or current.lesson_id != id:
        current = PracticeLesson(
            lesson_id=user.lessons[id].id,
            pair_id=1,
        )
        user.practice_lesson = current
        db.session.add(user.practice_lesson)
        db.session.commit()

    lesson = user.lessons[current.lesson_id - 1]
    return {"iffield": lesson.pairs[current.pair_id - 1].iffield}
