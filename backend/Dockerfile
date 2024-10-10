FROM python:3.12-slim

RUN pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app:$PYTHONPATH

EXPOSE 8000

COPY ./entrypoint.sh .
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
