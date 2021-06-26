from flask import Flask, render_template, session
from flask_bootstrap import Bootstrap
from flask_session import Session

from flask_wtf import FlaskForm
from flask_wtf.file import FileField

from wtforms import StringField, SubmitField
from wtforms.validators import Required

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SECRET_KEY'
app.config['SESSION_TYPE'] = 'filesystem'

bootstrap = Bootstrap(app)
Session(app)


class AnswerForm(FlaskForm):
    translation = StringField('', validators=[Required()],
                              render_kw={'autofocus': True})
    submit = SubmitField('submit')


class UploadForm(FlaskForm):
    file = FileField('Consider uploading a new file')
    upload = SubmitField('Upload')


@app.route('/', methods=['GET', 'POST'])
def index():
    upload = UploadForm()

    if upload.file.data:
        tasks = []
        for line in upload.file.data.readlines():
            original, expected = line.decode("utf-8").split("|")
            tasks.append((original.strip(), expected.strip()))
            session["tasks"] = tasks

    if "tasks" not in session:
        session["tasks"] = []

    prompt = None
    translation = None
    original = None
    correct = None

    if len(session["tasks"]) > 0:
        prompt = AnswerForm(form_type="inline")
        original, expected = next(iter(session["tasks"]))
        correct = prompt.translation.data == expected

    if correct:
        session["tasks"].pop(0)
        prompt.translation.render_kw = {'disabled': 'disabled'}
        prompt.submit.render_kw = {'autofocus': 'True'}
        prompt.submit.label.text = 'continue'

    return render_template(
        'index.html',
        prompt=prompt,
        translation=translation,
        original=original,
        correct=correct,
        upload=upload,
    )


if __name__ == '__main__':
    app.run(debug=True)
