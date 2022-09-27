import os

from flask import Flask

import app.models as users
from app import db, ma
from flask_session import Session

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
        if users.User.query.filter_by(username="bob").first() is None:
            users.register_user(db, "bob", "lol")
    app.run(debug=True)


if __name__ == "__main__":
    main()
