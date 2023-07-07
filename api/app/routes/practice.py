from __future__ import annotations

from apifairy import authenticate, body, response
from flask import Blueprint

from app import db, ma, token_auth
from app.models import PracticeLesson

practice = Blueprint("practice", __name__)


class PracticeInput(ma.Schema):
    iffield = ma.Str(required=True)
    finished = ma.Boolean(required=True)


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
    current_pair = lesson.pairs[current.pair_id - 1]
    current.pair_id += 1
    return {
        "iffield": current_pair.iffield,
        "finished": current.pair_id < len(lesson.pairs),
    }


class PracticeResponse(ma.Schema):
    offield = ma.Str(required=True)


@practice.route("/practice/<int:id>/", methods=["POST"])
@body(PracticeResponse)
@authenticate(token_auth)
def practice_verify(payload, id: int) -> dict[str, str]:
    user = token_auth.current_user()
    current = user.practice_lesson
    if current is None or current.lesson_id != id:
        raise RuntimeError("The app isn't working")

    lesson = user.lessons[current.lesson_id - 1]
    current_pair = lesson.pairs[current.pair_id - 1]
    current.pair_id += 1
    matched = current_pair.offield == payload["iffield"]
    if matched:
        user.practice_lesson.pair_id += 1
        db.session.add(user.practice_lesson)
        db.session.commit()

    return {
        "matched": matched,
    }
