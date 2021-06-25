from flask import Flask, render_template, session
from flask_bootstrap import Bootstrap
from flask_session import Session

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import Required

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SECRET_KEY'
app.config['SESSION_TYPE'] = 'filesystem'

bootstrap = Bootstrap(app)
Session(app)


class AnswerForm(FlaskForm):
    translation = StringField('', validators=[Required()])
    submit = SubmitField('submit')


@app.route('/', methods=['GET', 'POST'])
def index():
    if "tasks" not in session:
        session["tasks"] = [
            ("this is a first message", "first"),
            ("this is a second message", "second"),
            ("this is a third message", "third"),
            ("this is a fourth message", "fourth"),
        ]

    form = None
    translation = None
    original = None
    correct = None

    if len(session["tasks"]) > 0:
        form = AnswerForm(form_type="inline")
        original, expected = next(iter(session["tasks"]))
        correct = form.translation.data == expected

    if correct:
        session["tasks"].pop(0)

    return render_template(
        'index.html',
        form=form,
        translation=translation,
        original=original,
        correct=correct,
    )


if __name__ == '__main__':
    app.run(debug=True)
