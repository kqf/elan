from app import db
from app.models.user import User

preload_app = True


def on_starting(server):
    app = server.app.callable
    with app.app_context():
        db.create_all()
        if User.query.filter_by(username="bob").first() is None:
            User.register("bob", "lol")
