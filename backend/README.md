# Development Guide

Install all the required dependencies using `npm i`.

Copy the contents of `.env.example` file to `.env` and update the environment variables.

To run mongodb using docker, use

```shell
# have the container up and running
docker compose -f docker-compose-mongo.yml up --build

# to take the container down
docker compose -f docker-compose-mongo.yml down
```

or, you can update the `MONGO_URI` environment variable to point it to your own database server URL.

Run the development server using `npm run dev`.
