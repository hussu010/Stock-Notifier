# Stock Notifier

Get notified if stocks reaches price level.

# Project Details

We're using monolithic artitecture. Code for API (express.js) is located on the /backend folder and webapp (next.js) is located on the /frontend repo.

## Branching Rules

We are using **GitHub Flow** branching strategy. Developers create feature branches off the main branch, work on them, and then open pull requests to merge their changes back into the main branch.

### Naming temporary branches

Feature Branches (feat): Create a feature branch whenever you're working on a new feature or adding significant functionality to your project. Eg: `feat/authentication`

Bug Fix Branches (fix): Create a fix branch when you're addressing a bug or resolving an issue in your codebase. Eg: `fix/issue-name-or-id`

Chore Branches (chore): Chore branches typically involve non-functional tasks and maintenance work that improve the development workflow, project management, or documentation. Eg: `chore/add-endpoint-documentation`

Refactor Branches (refactor): Refactor branches focus on restructuring or improving the existing codebase without adding new features or fixing bugs. Eg: `refactor/improve-stock-fetch-algo`

## Development Guide (Deta)

Install Deta CLI: https://deta.space/docs/en/basics/cli

Update the default values of Spacefile to your environment variables.

Run `space dev`.

Navigate to `http://127.0.0.1:4200` for Frontend and `http://127.0.0.1:4200/api` for API.
