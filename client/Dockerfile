# IMPORTANT NOTE: Usually we don't need to run the client as an image 
# but for ease of setup during testing we're writing this dockerfile

################################
# Cleans the monorepository workspace leaving only the client related files

FROM node:18-alpine as cleaner 

WORKDIR /app

COPY . .

RUN npm i -g turbo

RUN turbo prune --scope=client --docker

################################
# Builds and runs the application

FROM node:18-alpine as runner

WORKDIR /app

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm i -g pnpm@9.6.0

COPY --from=cleaner /app/out/full/ .
COPY --from=cleaner /app/scripts ./scripts
COPY --from=cleaner /app/turbo.json ./turbo.json

RUN pnpm install --ignore-scripts

RUN pnpm build

WORKDIR /app/client

EXPOSE 5173

CMD ["sh", "-c",  "pnpm start"]