# Agents

This document defines development rules for contributors and coding agents working on Kalitka.

Before starting any task, read:

- `docs/PROJECT_CONTEXT.md`
- `docs/MASTER_SPEC.md`

Do not invent business logic. If a rule, requirement, or product behavior is not defined, leave a clear placeholder for later clarification.

## Core Principles

- Keep the product simple for the user.
- Prefer readability over complex solutions.
- Prefer modularity over monolithic implementation.
- Prioritize security.
- Keep the codebase ready for scaling.

## Clean Architecture

- Business logic must be separated from framework, transport, database, and external integration code.
- External systems must be accessed through explicit interfaces or adapters.
- Domain code must not depend directly on FastAPI, Next.js, PostgreSQL, 3x-ui, Telegram, payment providers, or other infrastructure details.
- Dependencies should point inward toward stable domain and application layers.

## Modular Structure

- The codebase must be organized by independent modules with clear ownership and boundaries.
- Each module must expose a clear public interface.
- Modules must avoid implicit coupling through shared mutable state.
- Cross-module interactions must happen through explicit contracts.

## Typing

- Typing is mandatory for all new code.
- Backend code must use explicit Python type annotations.
- Frontend code must use TypeScript types.
- Public functions, API contracts, configuration objects, and data models must be typed.
- Avoid untyped dynamic structures unless there is a documented reason.

## Code Style

- Use a single consistent code style across the project.
- Follow the formatters, linters, and conventions configured in the repository.
- If tooling is not configured yet, leave a placeholder and do not introduce a competing style.

<!-- TODO: Define exact backend formatter and linter. -->
<!-- TODO: Define exact frontend formatter and linter. -->
<!-- TODO: Define naming conventions for files, modules, functions, classes, and components. -->

## No Duplication

- Do not duplicate business rules, validation logic, API contracts, or configuration parsing.
- Extract shared behavior only when it is truly shared and stable.
- Keep abstractions small and practical.
- Avoid copy-pasting between modules.

## Commits

- Commit messages must be detailed enough to explain what changed and why.
- Commit messages must reference the affected area or module when possible.
- Avoid vague messages such as `fix`, `update`, or `changes`.

<!-- TODO: Define final commit message format. -->

## Environment Configuration

- Runtime configuration must be provided through `.env` files and environment variables.
- Secrets, tokens, credentials, URLs, and deployment-specific values must not be hardcoded.
- Provide documented examples for required environment variables.

<!-- TODO: Define `.env.example` structure. -->
<!-- TODO: Define required environment variables for backend, frontend, database, 3x-ui, Telegram, and deployment. -->

## New Features

- Every new feature must be implemented as an independent module.
- A feature module must contain only the logic needed for its responsibility.
- New features must not require unrelated modules to change unless an explicit shared contract changes.
- Product behavior must come from existing specifications or explicit task requirements.

## Scalability

- Code must be designed for future growth in users, servers, VPN clients, payment providers, and integrations.
- Avoid assumptions that only one VPN server, one protocol, one payment flow, or one client app will exist forever.
- Keep integrations replaceable through interfaces and adapters.
- Do not optimize prematurely, but do not hardcode choices that the project documents identify as replaceable.

## Testing

<!-- TODO: Define required testing strategy. -->
<!-- TODO: Define backend test framework. -->
<!-- TODO: Define frontend test framework. -->
<!-- TODO: Define minimum test requirements for new modules. -->

## API Contracts

<!-- TODO: Define API contract format. -->
<!-- TODO: Define versioning rules. -->
<!-- TODO: Define validation and error response rules. -->

## Database

<!-- TODO: Define migration tool and migration rules. -->
<!-- TODO: Define model naming conventions. -->
<!-- TODO: Define transaction boundaries. -->

## Security

<!-- TODO: Define authentication and authorization implementation rules. -->
<!-- TODO: Define secret management rules beyond `.env`. -->
<!-- TODO: Define logging restrictions for sensitive data. -->

## Documentation

- Update documentation when architecture, module boundaries, configuration, or operational behavior changes.
- Leave placeholders when a required rule is not yet defined.

<!-- TODO: Define documentation update requirements for each type of change. -->
