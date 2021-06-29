import os
from flask import Flask
from flask_bootstrap import Bootstrap
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy


from app.main.routes import main as main_bp

bootstrap = Bootstrap()
session = Session()
db = SQLAlchemy()


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
    app.register_blueprint(main_bp)
    return app


def main():
    app = build_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)


if __name__ == '__main__':
    main()
