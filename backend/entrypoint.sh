#!/bin/sh

echo "Applying migrations..."
python manage.py migrate --no-input

echo "Starting Daphne server..."
exec daphne -b 0.0.0.0 -p 8000 backend.asgi:application