import click

from app import db
from app.config import build_app
from app.models import User


@click.command()
@click.option("--infile", type=click.Path(exists=True))
def main(infile):
    app = build_app()
    with app.app_context():
        db.create_all()
        if User.query.filter_by(username='bob').first() is None:
            User.register('bob', 'lol')
    app.run(debug=True)


if __name__ == '__main__':
    main()
