from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


@app.route("/test")
def test() -> dict[str, int]:
    return {"mymessage": 123}
