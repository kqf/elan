from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app.models import Lesson, Pair, User


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True

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
