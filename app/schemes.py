from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app import ma
from app.models import Lesson, Pair, User


class UserSchema(SQLAlchemyAutoSchema, ma.SQLAlchemySchema):
    class Meta:
        model = User
        ordered = True

    # id = ma.auto_field(dump_only=True)
    # url = ma.String(dump_only=True)
    # email = ma.auto_field(required=True)
    password = ma.auto_field(required=True, load_only=True)


class LessonSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Lesson
        include_fk = True
        load_instance = True


class PairSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Pair
        include_fk = True
        load_instance = True
