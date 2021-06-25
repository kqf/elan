all:
	python app/run.py

clean:
	rm -rf flask_session

.PHONY: clean
