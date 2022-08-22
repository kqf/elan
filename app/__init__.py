from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
lm = LoginManager()
basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()

lm.login_view = "main.login"
