# Flag-Engine

A clean, production-minded feature flag service built with Node.js, Express, and SQLite.

This project implements a flexible feature flag system where global defaults can be overridden at the user or group level.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server (port 3000 by default)
npm start

# Run unit tests
npm test
```

## API Highlights

### Flags
- `GET /flags`: List all flags.
- `POST /flags`: Create a new flag (keys must be unique).
- `PUT /flags/:key`: Update flag status or description.
- `DELETE /flags/:key`: Cleanly remove a flag (cascades to overrides).

### Overrides
- `PUT /flags/:key/overrides/:type/:targetId`: Set an override. Type is `user` or `group`.
- `DELETE /flags/:key/overrides/:type/:targetId`: Remove an override.

### Resolution
- `GET /resolve/:key?userId=abc&groupId=xyz`: Check if a feature is on for a specific context.

## Design Decisions & Tradeoffs

- **SQLite (better-sqlite3)**: Chosen for its zero-config nature and high performance in a single-process environment. Using the synchronous driver (`better-sqlite3`) simplifies the code significantly, making it easier to read and maintain without the overhead of async/await boilerplate for every simple query.
- **Controller-Service Architecture**: The project is structured into three clear layers:
    - **Routes**: Define the API endpoints and map them to controllers.
    - **Controllers**: Handle HTTP requests, input validation, and send responses.
    - **Services**: Contain the core business logic and direct database interactions using clean SQL queries.
- **Pure Resolution Logic (Services)**: The core resolution logic is decoupled from the database and Express (see `resolveService.js`). This made it trivial to write comprehensive unit tests that cover precedence and edge cases without needing a mock database.
- **Precedence**: `User Override > Group Override > Global Default`. This is a standard pattern that allows for granular control while maintaining sensible defaults.
- **REST Only**: Kept focuses strictly on the API as per requirements. No UI or complex caching was added to keep the "2-hour craft" realistic and maintainable.

## Assumptions Made

- **Context Identification**: I assumed that the calling application is responsible for providing valid `userId` or `groupId` strings.
- **Security**: As per the challenge constraints, no authentication or authorization layer was implemented. In a real production scenario, this would be behind a VPC or have an API key/JWT validation layer.
- **Conflict Handling**: For overrides, I used an Upsert pattern (`INSERT ... ON CONFLICT`). This keeps the API clean, as clients don't need to check for existence before updating an override.

## Known Limitations

- **Concurrency**: While SQLite handles concurrent reads well, it has a single writer. For a massive scale system, we'd eventually move to PostgreSQL.
- **Caching**: Currently every resolution hits the database. For a high-throughput system, I'd implement an in-memory TTL cache (like `lru-cache`) or use Redis.
- **Audit Logs**: There's currently no history of who changed what flag and when.

## What's Next? (With more time)

1.  **Audit Trail table**: To track all mutations for compliance and debugging.
2.  **Batch Resolution**: An endpoint to resolve multiple flags at once for a given user context.
3.  **Client SDKs**: Lightweight wrappers around the resolution endpoint for popular languages.
4.  **Percentage Rollouts**: Adding a `percentage` field to flags to allow for A/B testing or canary releases.

---

*Note: I used AI tools (ChatGPT ) for high-level design guidance and to sanity-check edge cases and test scenarios.
All core logic, API structure, and final implementation decisions were written and refined by me.*