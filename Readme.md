# Telegram Bot Template with Examples

Using NodeJs, Typescript/JavaScript, Docker.

## Development

- Create `.env` file and add the `TELEGRAM_TOKEN = ...`.
- Run `npm start`
- Start a chat with your bot on Telegram

## Setup

From the container registry:

- `docker-compose.yml`:

  ```yml
  version: '3.4'

  services:
    vac-alert-bot:
      image: ghcr.io/...
      environment:
        TELEGRAM_TOKEN: '...'
      restart: unless-stopped
      volumes:
        - ./data:/usr/src/app/data

  volumes:
    data:
  ```

- Run `docker-compose up -d`

or local:

- Create `.env` file and add the `TELEGRAM_TOKEN = ...`.
- Run `docker-compose up -d`
