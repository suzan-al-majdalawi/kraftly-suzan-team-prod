## Efter kör:

docker compose down
docker compose up -d --build --force-recreate
docker compose exec web printenv APP_ENV

### staging
