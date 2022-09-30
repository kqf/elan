all:
	gunicorn 'api.app.config:build_app()'

clean:
	rm -rf flask_session

.PHONY: clean
