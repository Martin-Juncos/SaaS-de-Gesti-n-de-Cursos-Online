# Backend Configuration

## Required variables

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: secret key used to sign JWT tokens.

## Optional variables

- `NODE_ENV`: runtime mode. Default `development`.
- `PORT`: API port. Default `4000`.
- `CORS_ORIGIN`: allowed frontend origin. Default `http://localhost:5173`.
- `DATABASE_SSL`: use SSL for PostgreSQL (`true` or `false`). Default `false`.
- `JWT_EXPIRES_IN`: token expiration. Default `1d`.
- `JWT_ISSUER`: token issuer claim. Default `course-saas`.
- `JWT_AUDIENCE`: token audience claim. Default `course-saas-users`.
- `ADMIN_EMAIL`: bootstraps an admin account on startup when set.
- `ADMIN_PASSWORD`: admin password for bootstrap.
- `ADMIN_NAME`: admin display name. Default `Platform Admin`.

## Startup validation

The app fails fast at startup when required values are missing or malformed:

- missing `DATABASE_URL`
- missing `JWT_SECRET`
- invalid `PORT`
- invalid `DATABASE_SSL` value
