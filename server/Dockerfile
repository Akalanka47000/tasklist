################################
# Cleans the monorepository workspace leaving only the server related files

FROM node:18-alpine as cleaner 

WORKDIR /app

COPY . .

RUN npm i -g turbo

RUN turbo prune --scope=server --docker

################################
# Builds and runs the application

FROM node:20-alpine as runner

WORKDIR /app

RUN npm i -g pnpm@9.6.0

COPY --from=cleaner /app/out/full/ .
COPY --from=cleaner /app/scripts ./scripts

RUN pnpm install --ignore-scripts

COPY --from=cleaner /app/out/full/ .

WORKDIR /app/server

RUN pnpm build

CMD ["sh", "-c",  "pnpm start"]