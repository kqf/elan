from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
ma = Marshmallow()
basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()
