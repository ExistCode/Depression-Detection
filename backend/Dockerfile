FROM python:3.11
WORKDIR /app

# Install system dependencies
#RUN apt-get update
RUN apt-get install -y gcc
RUN rm -rf /var/lib/apt/lists/*
#RUN apt-get update && apt-get install -y \
#    gcc \
#    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV PORT 8080
ENV HOST 0.0.0.0

# Install gunicorn
RUN pip install gunicorn

# Update the CMD to properly bind to HOST:PORT
CMD exec gunicorn --bind 0.0.0.0:$PORT app:app --workers 1 --timeout 0
