import os  # isort: skip

from flask import Flask  # isort: skip

from flask_session import Session  # isort: skip
from flask_cors import CORS

from app import db, ma  # isort: skip
from app.models import User, register_user  # isort: skip

session = Session()


def build_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "SECRET_KEY"
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
        os.path.dirname(__file__), "../data-dev.sqlite3"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
    app.config["ACCESS_TOKEN_MINUTES"] = 90
    app.config["REFRESH_TOKEN_DAYS"] = 180
    CORS(app)

    session.init_app(app)
    db.init_app(app)
    ma.init_app(app)

    from app.routes.auth import auths
    from app.routes.lesson import lessons
    from app.routes.pair import pairs
    from app.routes.users import users

    app.register_blueprint(lessons)
    app.register_blueprint(pairs)
    app.register_blueprint(auths)
    app.register_blueprint(users)
    return app


# NB: Use this for flask-debug purposes only
def main():
    app = build_app()
    with app.app_context():
        db.create_all()
        if User.query.filter_by(username="bob").first() is None:
            register_user(db, "bob", "lol", "bob@lol.com")
    app.run()
    return app


if __name__ == "__main__":
    main()
