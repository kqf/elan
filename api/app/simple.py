import os  # isort: skip

from flask import Flask  # isort: skip
from flask_cors import CORS  # isort: skip
from app import db  # isort: skip

from app import ma  # isort: skip

# from app.routes.auth import auths
# from app.routes.lesson import lessons
# from app.routes.pair import pairs
# from app.routes.users import users

app = Flask(__name__)
cors = CORS(app)
app.config["SECRET_KEY"] = "SECRET_KEY"
app.config["SESSION_TYPE"] = "filesystem"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    os.path.dirname(__file__), "../data-dev.sqlite3"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
app.config["ACCESS_TOKEN_MINUTES"] = 90
app.config["REFRESH_TOKEN_DAYS"] = 18
db.init_app(app)
db.init_app(db)
ma.init_app(app)


# app.register_blueprint(lessons)
# app.register_blueprint(pairs)
# app.register_blueprint(auths)
# app.register_blueprint(users)


@app.route("/test")
def test() -> dict[str, str]:
    return {"mymessage": "Hello world"}
