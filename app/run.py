from app import db
from app.config import build_app
from app.models import User


def main(filename):
    app = build_app()
    with app.app_context():
        db.create_all()
        if User.query.filter_by(username='bob').first() is None:
            User.register('bob', 'lol')
    app.run(debug=True)


if __name__ == '__main__':
    main()
