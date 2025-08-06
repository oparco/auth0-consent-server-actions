# ReadMe for Auth0 Action: Management API Access Token Caching

## Overview
This Auth0 Action (`onExecutePostLogin`) handles the retrieval and caching of Management API access tokens using the client credentials flow. The purpose is to efficiently manage access tokens for calling the Auth0 Management API during user login events.

## Key Features

1. **Token Caching**: Implements a caching mechanism to store and reuse Management API access tokens
2. **Client Credentials Flow**: Obtains new tokens when cache is empty or expired
3. **Error Handling**: Includes basic error handling for token retrieval failures

## Configuration Requirements

### Secrets Needed:
- `AUTH0_CUSTOM_DOMAIN`: Your Auth0 tenant domain (e.g., `your-domain.auth0.com`)
- `CLIENT_ID`: Client ID for the Machine-to-Machine application
- `CLIENT_SECRET`: Client secret for the Machine-to-Machine application
- `ACCOUNT_API`: Audience for the Management API (typically `https://your-domain.auth0.com/api/v2/`)

## How It Works

1. On each login event, the action checks the cache for an existing valid token
2. If found, it uses the cached token
3. If not found, it requests a new token using client credentials flow
4. New tokens are cached with a TTL of ~24 hours (86,000 seconds)
5. The token is then available for subsequent Management API calls

## Cache Behavior
- Cache key: "M2M"
- TTL: 86,000 seconds (~24 hours)
- The cache is shared across all executions of this action

## Error Handling
The action logs errors when:
- Token request fails
- Invalid token is received
- Cache operations fail

## Usage Notes
- This action is designed to be used as part of a larger flow where Management API calls are needed during login
- The actual Management API calls would need to be implemented separately using the retrieved token
- The token is not currently exposed to the calling context - you may want to add this if needed

## Logging
The action provides detailed console logging for debugging purposes, including:
- Cache hits/misses
- Token request status
- Token validation results
- Error conditions

## Dependencies
- Requires Auth0 Actions with cache capability
- Requires fetch API support in the Actions environment