from flask_wtf import FlaskForm
from flask_wtf.file import FileField

from wtforms import StringField, SubmitField
from wtforms.validators import Required


class AnswerForm(FlaskForm):
    translation = StringField('', validators=[Required()],
                              render_kw={'autofocus': True})
    submit = SubmitField('submit')


class UploadForm(FlaskForm):
    file = FileField('Consider uploading a new file')
    upload = SubmitField('Upload')
