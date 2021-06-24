from flask import Flask, render_template, session
from flask_bootstrap import Bootstrap

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import Required

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SECRET_KEY'

bootstrap = Bootstrap(app)


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

    translation = None
    form = AnswerForm(form_type="inline")
    print(session["tasks"])

    if len(session["tasks"]) == 0:
        return render_template(
            'index.html',
            form=form,
            translation=translation,
            original="You are done",
        )

    original, correct = next(iter(session["tasks"]))

    if form.translation.data is None:
        return render_template(
            'index.html',
            form=form,
            translation=translation,
            original=original,
        )

    print(correct)

    if form.validate_on_submit() and form.translation.data == correct:
        translation = form.translation.data
        form.translation.data = None
        session["tasks"].pop(0)
        original, correct = next(iter(session["tasks"]))
        print(session["tasks"])
        print("After pop", correct)

    return render_template(
        'index.html',
        form=form,
        translation=translation,
        original=original,
    )


if __name__ == '__main__':
    app.run(debug=True)
