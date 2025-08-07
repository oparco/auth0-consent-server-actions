# auth0-consent-server-actions

This project provides a set of Auth0 Actions to manage user consent and token enrichment for various document types in your application.


## Requirements

- Node.js (v18 or later recommended)
- Auth0 account with configured Actions
- Access to Auth0 Dashboard with permissions to create and manage Actions
- Auth0 Application (API) for Machine-to-Machine (M2M) authentication
- Environment variables for Auth0 domain, client ID, and client secret

## Usage

### 1. Obtain M2M Token

First, you need to obtain a Machine-to-Machine (M2M) token from Auth0. This token is required to authenticate and authorize subsequent actions.

### 2. Consent Actions Flow

The consent process consists of several steps, each handled by a specific action:

#### a. General Consent

- Use the **General Consent Action** to request and record user consent for general application usage.

#### b. Document Consent

- Use the **Document Consent Action** to request and record user consent for accessing or processing specific documents.

#### c. Marketing Documents Consent

- Use the **Marketing Documents Consent Action** to request and record user consent for marketing-related documents.

### 3. Enrich Token with Scopes

After all required consents (general, document, and marketing) are successfully obtained, use the **Enrich Token Action**. This action will enrich the user's token with the appropriate scopes based on the consents provided.

## Summary

1. Get M2M token from Auth0.
2. Run General Consent Action.
3. Run Document Consent Action.
4. Run Marketing Documents Consent Action.
5. If all consents are granted, run Enrich Token Action to update token scopes.

## Requirements

- Node.js
- Auth0 account with configured Actions

## License

MIT