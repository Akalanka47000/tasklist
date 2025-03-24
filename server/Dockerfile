FROM oven/bun:1.2.2-alpine AS runner

WORKDIR /app

RUN apk add --no-cache --update jq redis

COPY patches ./patches

COPY packages ./packages

COPY server ./server

COPY package.json bun.lock ./

RUN sh ./server/scripts/prune.sh server

RUN echo -e "[install]\ndev=false" > bunfig.toml

RUN bun install --ignore-scripts

EXPOSE 8080

# Not a good practice to run redis in the same container as the server
# But for the sake of simplicity of this deployment, we are doing it here
CMD ["sh", "-c",  "redis-server --daemonize yes && cd ./server && bun start"]