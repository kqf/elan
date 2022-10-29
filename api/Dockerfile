FROM python:3.10
WORKDIR /app

COPY api .
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
RUN pip install -e .
ENV FLASK_ENV production

EXPOSE 5050
CMD ["gunicorn", "-b", ":5050", "app.simple:main()"]
