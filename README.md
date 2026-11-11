# WanderLanka transport service

Node 22 / Express / MongoDB microservice. Default port: 3002. Entrypoint: `src/server.js`.

Public `/transportation`, `/transportation/:id` and `/vehicles/all` routes expose vehicle browsing. Provider `/vehicles` CRUD routes require an access token with the transport role; updates and deletes filter by the owning provider. Legacy provider aliases remain available.

## Run and test

```sh
npm ci
cp .env.example .env
npm start
npm test
```

Set `JWT_SECRET` to the same private signing secret as user-service. Production startup requires a JWT secret of at least 32 characters and an explicit MongoDB URI. Relevant service settings: MONGO_URI. `PORT` and `HOST` override the listener. Internal callers use a separate private `INTERNAL_SERVICE_TOKEN`; never include it in client builds.

`GET /health` checks liveness. `GET /ready` returns 200 only while MongoDB is connected. Importing the application does not connect to MongoDB or start a listener. SIGINT/SIGTERM close HTTP connections and the database with a bounded shutdown deadline.

Tests use Node's built-in test runner and disposable loopback listeners; the suite does not need a live database or third-party credentials. See the workspace readiness report for integration results and release blockers. The Dockerfile and GitHub Actions workflow provide container and test verification; image execution still needs a working Docker daemon.
