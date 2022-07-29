from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
lm = LoginManager()
lm.login_view = "main.login"
