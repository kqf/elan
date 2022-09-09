from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app.models import Lesson, User


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True


class LessonSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Lesson
        include_fk = True
        load_instance = True
