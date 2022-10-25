import os  # isort: skip

from flask import Blueprint, Flask  # isort: skip
from flask_cors import CORS  # isort: skip
from app import db  # isort: skip
from app import ma  # isort: skip

from app.routes.auth import auths
from app.routes.lesson import lessons
from app.routes.pair import pairs
from app.routes.users import users

simple = Blueprint("simple", __name__)


@simple.route("/test")
def test() -> dict[str, str]:
    return {"mymessage": "Hello world"}


def build_app():
    app = Flask(__name__)
    CORS(app)
    app.config["SECRET_KEY"] = "SECRET_KEY"
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
        os.path.dirname(__file__), "../data-dev.sqlite3"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
    app.config["ACCESS_TOKEN_MINUTES"] = 90
    app.config["REFRESH_TOKEN_DAYS"] = 18
    db.init_app(app)
    ma.init_app(app)

    app.register_blueprint(lessons)
    app.register_blueprint(pairs)
    app.register_blueprint(auths)
    app.register_blueprint(users)
    app.register_blueprint(simple)
    return app


def main():
    app = build_app()
    # with app.app_context():
    #     db.create_all()
    #     if User.query.filter_by(username="bob").first() is None:
    #         register_user(db, "bob", "lol", "bob@lol.com")
    app.run()
    return app


if __name__ == "__main__":
    main()
