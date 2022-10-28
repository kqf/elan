FROM python:3.10
WORKDIR /app

COPY api/* ./
RUN pip install --no-cache-dir -r ./requirements.txt
RUN pip install -e .
ENV FLASK_ENV production

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "api:app"]
