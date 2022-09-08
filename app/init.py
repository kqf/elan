import app.models as users
from app import db

preload_app = True


def on_starting(server):
    app = server.app.callable
    with app.app_context():
        db.create_all()
        if users.User.query.filter_by(username="bob").first() is None:
            users.register(db, "bob", "lol")
