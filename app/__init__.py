from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
lm = LoginManager()
lm.login_view = 'main.login'
