# Auth0 Consent Redirect Action by oparco

This Action redirects users to the Consent Server if they have not yet signed the required documents.

---

## ⚙️ What this Action does

- Checks if the user has signed the required consents.
- If not signed, redirects the user to the consent page.
- Handles user return: denies access if the user declines consent.
- Supports filtering by `client_id` and other configurable settings.

---

## 🔐 Required Secrets

| Secret                         | Description                                                   |
|--------------------------------|---------------------------------------------------------------|
| `CONSENT_SERVER_REDIRECT_URL`  | The URL where users are redirected to sign consents           |
| `CONSENT_SERVER_BACKEND_URL`   | The backend URL used to check consent signing status           |
| `SESSION_TOKEN_SECRET`          | Secret used to sign the session token                          |

---

## 🛠 Installation in Auth0

1. In the Auth0 Dashboard, go to **Actions → Library** and create a new Action.
2. Choose the **Post-Login** trigger and paste the contents of `index.js`.
3. Set the required Secrets as described in the table above.
4. Add the Action to your **Login Flow** after the Credentials step.

---


