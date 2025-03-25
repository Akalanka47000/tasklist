################################
# Cleans the monorepository workspace leaving only the server related files

FROM node:18-alpine as cleaner 

WORKDIR /app

COPY . .

RUN yarn global add turbo pnpm

RUN turbo prune --scope=$service --docker

################################
# Builds and runs the application

FROM node:18-alpine as runner

WORKDIR /app

RUN yarn global add pnpm

COPY .gitignore .gitignore

COPY --from=cleaner /app/out/json/ .
COPY --from=cleaner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=cleaner /app/scripts ./scripts

RUN pnpm install --ignore-scripts

COPY --from=cleaner /app/out/full/ .

RUN pnpm build --filter=server

CMD ["sh", "-c",  "pnpm start --filter=server"]