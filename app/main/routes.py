from flask import render_template, session
from flask import redirect, url_for, request

from flask_login import login_user

from app.main import main
from app.main.forms import UploadForm, AnswerForm, LoginForm
from app.models import User



@main.route('/', methods=['GET', 'POST'])
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


@main.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.verify_password(form.password.data):
            return redirect(url_for('main.login', **request.args))
        login_user(user, form.remember_me.data)
        return redirect(request.args.get('next') or url_for('main.index'))
    return render_template('login.html', form=form)
