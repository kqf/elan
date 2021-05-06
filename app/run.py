from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_wtf import Form
from wtforms import StringField, SubmitField
from wtforms.validators import Required

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SECRET_KEY'
bootstrap = Bootstrap(app)


class AnswerForm(Form):
    translation = StringField('', validators=[Required()])
    submit = SubmitField('submit')


@app.route('/', methods=['GET', 'POST'])
def index():
    vocab = {"test": "test"}
    translation = None
    form = AnswerForm(form_type="inline")
    for original, correct in vocab.items():
        while translation == correct:
            if form.validate_on_submit():
                translation = form.translation.data
                form.translation.data = ''

            render_template(
                'index.html',
                form=form,
                translation=translation,
                original=original,
            )

    return render_template(
        'index.html',
        form=form,
        translation=translation,
        original=original,
    )


if __name__ == '__main__':
    app.run(debug=True)
