Oparco's enrich token action

This Auth0 action checks the scopes requested during login by checking the Consent Server backend. If the scopes are not allowed, access is denied. If the scopes are valid, we enrich the token with them.

## Secrets

- `CONSENT_SERVER_BACKEND_URL` is the base URL for the backend API used to check scopes.

## Installation

1. Create a new action after login in the Auth0 dashboard.
2. Paste the contents of the `index.js` file.
3. Add the required secret.
4. Add the action to the login flow.

## Notes

- The action ignores non-redirect protocols such as password, token exchange, and refresh token.
- If the `dropConsent` client metadata is `'true'`, the action skips execution.