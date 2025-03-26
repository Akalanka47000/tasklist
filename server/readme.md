# Task List Server

Node service for Task List

</br>

## [API Documentation](https://documenter.getpostman.com/view/32343835/2sAYkKGcHH)

## File Structure

- config - Environmental configuration
- database - Database configurations and augmentations
  - mongo - MongoDB
  - redis - Redis
- locales - Translations if needed
- modules - Core modules of the application organized into API versions
- middleware - Shared middleware between modules
- utils - Shared utilities between modules

</br>

## Basic Commands

- `pnpm dev` - Starts the server in dev mode
- `pnpm build` - Builds the server using [Esbuild](https://esbuild.github.io)
- `pnpm start` - Runs the built server with node

## Running migrations and seeders

- `pnpm migrate up` or `pnpm seed up` - Runs migrations or seeders

- `pnpm migrate down` or `pnpm seed down` - Rollbacks migrations or seeds

</br>

## Auditing

- Auditing is managed automatically if enabled at the model level through the `@sliit-foss/mongoose-audit` plugin and provides a detailed description of the changes which has occurred to the database models

- Audits can be viewed at the `audits` collection within the database

</br>

## Tests

- `pnpm test` - First test execution may take some time since it starts 2 docker container for MongoDB and Redis.

</br>
