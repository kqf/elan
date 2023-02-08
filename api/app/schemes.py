from app import ma
from app.models import Lesson, Pair, User


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = False
        load_instance = False

    id = ma.auto_field(dump_only=True)
    url = ma.String(dump_only=True)
    email = ma.auto_field(required=True)
    password_hash = ma.auto_field(required=True, load_only=True)


class LessonSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Lesson
        include_fk = False
        load_instance = False

    id = ma.auto_field(required=True, load_only=True)
    user_id = ma.auto_field(required=False, load_only=True)
    pairs = ma.Nested(
        "PairSchema", many=True, exclude=("lesson",), load_only=True
    )


class PairSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Pair
        include_fk = False
        load_instance = False

    id = ma.auto_field(required=True, load_only=True)
    lesson_id = ma.auto_field(required=True, load_only=True)
    lesson = ma.Nested("LessonSchema", exclude=("pairs",), load_only=True)
