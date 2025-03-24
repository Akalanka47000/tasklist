# Task List

This is a [Turborepo](https://turbo.build/repo) designed to house all components of this advanced tasklist

</br>

## [API Documentation](https://documenter.getpostman.com/view/32343835/2sAYdhKqVB)

## File Structure

- client - Frontend application for Finance digest
- packages - All shared packages
  - config-eslint - ESLint configurations
  - constants - Common constants
  - types - Common type definitions
- server - Backend service for Finance digest
- commitlint.config.js - Commitlint configuration file
- lefthook.yml - Lefthook configuration file
- tsconfig.json - Base TypeScript configuration file
- turbo.json - Turbo configuration file

</br>

## Prerequisites

- [Node](https://nodejs.org) (Version 18 or higher).
- You will need to create a `.env` at the root of every workspace and fill in the required keys. The services will not start without them.
- A [MongoDB](https://www.mongodb.com) and a [Redis](https://redis.io/) data source.

</br>

## Commands

- `pnpm install` - Installs all dependencies for all workspaces
- `pnpm dev` - Runs a development server for both client and server

## Running migrations

- `pnpm migrate --filter server` - Runs migrations for the server workspace, or you could navigate to the server workspace and run `pnpm migrate`

</br>

## Utilities

This turborepo has some additional tools already setup for you:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
