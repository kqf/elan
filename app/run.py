from flask import Flask
from flask_bootstrap import Bootstrap
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy


from app.main.routes import main as main_bp
from app.models import User

bootstrap = Bootstrap()
session = Session()
db = SQLAlchemy()


def build_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'SECRET_KEY'
    app.config['SESSION_TYPE'] = 'filesystem'

    bootstrap.init_app(app)
    session.init_app(app)
    app.register_blueprint(main_bp)
    db.init_app(app)
    return app


def main():
    app = build_app()
    with app.app_context():
        db.create_all()
        if User.query.filter_by(username='john').first() is None:
            User.register('bob', 'lol')
    app.run(debug=True)


if __name__ == '__main__':
    main()
