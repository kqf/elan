from __future__ import annotations

from typing import Any

from apifairy import authenticate, body, response
from flask import Blueprint

from app import db, ma, token_auth
from app.models import PracticeLesson

practice = Blueprint("practice", __name__)


class PracticeInput(ma.Schema):
    iffield = ma.Str(required=True)
    finished = ma.Boolean(required=True)
    n_current = ma.Integer(required=True)
    n_total = ma.Integer(required=True)


@practice.route("/practice/<int:id>/", methods=["GET"])
@authenticate(token_auth)
@response(PracticeInput)
def practice_start(id: int) -> dict[str, Any]:
    user = token_auth.current_user()
    current = user.practice_lesson
    if current is None or current.lesson_id - 1 != id:
        current = PracticeLesson(
            lesson_id=user.lessons[id].id,
            pair_id=1,
        )
        user.practice_lesson = current
        db.session.add(user.practice_lesson)
        db.session.commit()

    lesson = user.lessons[current.lesson_id - 1]
    current_pair = lesson.pairs[current.pair_id - 1]

    return {
        "iffield": current_pair.iffield,
        "finished": current.pair_id + 1 < len(lesson.pairs),
        "n_current": current.pair_id,
        "n_total": len(lesson.pairs),
    }


class PracticeResponseInput(ma.Schema):
    offield = ma.Str(required=True)


class PracticeResponseResponse(ma.Schema):
    matched = ma.Boolean(required=True)


@practice.route("/practice/<int:id>/", methods=["POST"])
@authenticate(token_auth)
@body(PracticeResponseInput)
@response(PracticeResponseResponse)
def practice_verify(payload, id: int) -> dict[str, str]:
    user = token_auth.current_user()
    current = user.practice_lesson
    if current is None or current.lesson_id - 1 != id:
        raise RuntimeError("The practice has not been started")

    lesson = user.lessons[current.lesson_id - 1]
    current_pair = lesson.pairs[current.pair_id - 1]
    matched = current_pair.offield == payload["offield"]
    print(current_pair.offield, payload["offield"])
    if matched:
        updated = PracticeLesson(
            lesson_id=user.lessons[id].id,
            pair_id=current.pair_id + 1,
        )
        user.practice_lesson = updated
        db.session.add(user.practice_lesson)
        db.session.commit()

    return {
        "matched": matched,
    }
