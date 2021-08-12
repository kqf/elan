import os
from flask import Flask
from flask_bootstrap import Bootstrap
from flask_session import Session

from app import db, lm
from app.main.routes import main as main_bp
from app.models import User

bootstrap = Bootstrap()
session = Session()


def build_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'SECRET_KEY'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(
        os.path.dirname(__file__), '../data-dev.sqlite3')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    bootstrap.init_app(app)
    session.init_app(app)
    db.init_app(app)
    lm.init_app(app)

    app.register_blueprint(main_bp)
    return app


# NB: Use this for flask-debug purposes only
def main():
    app = build_app()
    with app.app_context():
        db.create_all()
        if User.query.filter_by(username='bob').first() is None:
            User.register('bob', 'lol')
    app.run(debug=True)


if __name__ == '__main__':
    main()
