## Requirements

- OS: Linux (scripts can work differently on different systems)

## Migrations

- To create an empty migration:
  `npm run migration:create --name=<migration-name>`

- To generate a migration:
  `npm run migration:generate --name=<migration-name>`

- To revert the last migration:
  `npm run migration:revert`

- To run a migration:
  `npm run migration:run`

> **NOTE:** Migrations run automatically in both staging and production environments.

> **IMPORTANT:**
>
> - Do not connect your local server to the staging database; use a local database for development.
> - Do not use TypeORM Sync.
> - Do not edit migrations that have already been deployed.
