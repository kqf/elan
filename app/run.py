from app.main.config import build_app


def main():
    app = build_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)


if __name__ == '__main__':
    main()
