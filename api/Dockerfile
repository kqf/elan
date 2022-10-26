FROM python:3.10
WORKDIR /app

COPY api/requirements.txt api/app api/.flaskenv ./
RUN pip install -r ./requirements.txt
ENV FLASK_ENV production

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "api:app"]
