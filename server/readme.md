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

- `pnpm dev` - Starts server in dev mode
- `pnpm build` - Builds the server using
- `pnpm start` - Runs the built server with node

## Running migrations and seeders

- `pnpm migrate up` or `pnpm seed up` - Runs migrations or seeders

- `pnpm migrate down` or `pnpm seed down` - Rollbacks migrations or seeds

</br>
