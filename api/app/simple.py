import os  # isort: skip

from flask import Flask  # isort: skip
from flask_cors import CORS  # isort: skip

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


@app.route("/test")
def test() -> dict[str, int]:
    return {"mymessage": 123}
