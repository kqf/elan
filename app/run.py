from flask import Flask
from flask_bootstrap import Bootstrap
from flask_session import Session

from app.main.routes import main as main_bp

bootstrap = Bootstrap()
session = Session()


def build_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'SECRET_KEY'
    app.config['SESSION_TYPE'] = 'filesystem'

    bootstrap.init_app(app)
    session.init_app(app)
    app.register_blueprint(main_bp)
    return app


def main():
    app = build_app()
    app.run(debug=True)


if __name__ == '__main__':
    main()
