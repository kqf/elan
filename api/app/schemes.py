from app import ma
from app.models import Genre, Lesson, Movie, Pair, Token, User


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

    id = ma.auto_field(dump_only=True)
    url = ma.String(dump_only=True)
    email = ma.auto_field(required=True)
    password_hash = ma.auto_field(required=True, load_only=True)


class PairSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Pair

    id = ma.auto_field(required=True, load_only=True)
    iffield = ma.auto_field(required=True)
    offield = ma.auto_field(required=True)
    # lesson_id = ma.auto_field(required=True, load_only=True)


class LessonSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Lesson

    id = ma.auto_field(required=True, load_only=True)
    # user_id = ma.auto_field(required=False, load_only=True)
    lessons = ma.Nested(PairSchema, many=True, required=True)


class TokenSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Token


class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre


class MovieSchema(ma.SQLAlchemyAutoSchema):
    genre = ma.Nested(GenreSchema)

    class Meta:
        model = Movie
