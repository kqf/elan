import os
from flask import Flask
from flask_bootstrap import Bootstrap
from flask_session import Session

from app import db, lm
from app.main.routes import main as main_bp

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
