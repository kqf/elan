from flask import Blueprint, render_template, session
from app.main.forms import UploadForm, AnswerForm

main = Blueprint("main", __name__)


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
