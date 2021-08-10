import click
from app import db
from app.config import build_app
from app.models import User


@click.command()
@click.option("--filename", type=click.Path(exists=True))
def main(filename):
    tasks = []
    with open(filename) as f:
        for line in f.readlines():
            original, expected = line.decode("utf-8").split("|")
            tasks.append((original.strip(), expected.strip()))

    app = build_app()
    app.session['tasks'] = tasks

    with app.app_context():
        db.create_all()
        if User.query.filter_by(username='bob').first() is None:
            User.register('bob', 'lol')
    app.run(debug=True)


if __name__ == '__main__':
    main()
