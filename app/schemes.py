from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app import ma
from app.models import Lesson, Pair, User


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        ordered = True

    id = ma.auto_field(dump_only=True)
    url = ma.String(dump_only=True)
    username = ma.auto_field(required=True)
    email = ma.auto_field(required=True)

    def jsonify(self, *args, **kwargs):
        return self.dump(*args, **kwargs)


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
