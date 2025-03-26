# Task List

This is a [Turborepo](https://turbo.build/repo) designed to house all components of this advanced tasklist

</br>

## [API Documentation](https://documenter.getpostman.com/view/32343835/2sAYkKGcHH)

</br>

## Quick Setup (With Docker)

- Run `docker compose up` to boostrap and spin a runtime environment
  - Client - Available at http://localhost:5173
  - Server - Available at http://localhost:8080

</br>

## File Structure

- client - Frontend React application for TaskList
- packages - All shared packages
  - config-eslint - ESLint configurations
  - constants - Common constants
  - types - Common type definitions
- server - Backend service for TaskList
- commitlint.config.js - Commitlint configuration file
- lefthook.yml - Lefthook configuration file
- pnpm-workspace.yaml - Configures the workspaces so that PNPM can work properly
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
- `pnpm dev` - Starts both client and server in dev mode
- `pnpm start` - Builds and starts both client and server
- `pnpm test` - Runs tests suites within both client and server however for readability it is better to execute this one workspace at a time

## Running migrations and seeders

- To run migrations - Navigate to the server workspace and run `pnpm migrate up` or `pnpm seed up`.

- To Rollback - Navigate to the server workspace and run `pnpm migrate down` or `pnpm seed down`

</br>

## Utilities

This turborepo has some additional tools already setup for you:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
