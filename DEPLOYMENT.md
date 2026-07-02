# LuxDrape — Deployment & Operations Guide

## Architecture

- **Frontend:** React 19 + Vite 7 + TypeScript, deployed as a static SPA on Vercel.
- **Privileged backend:** One Vercel serverless function — `api/admin-users.js` — using the
  Firebase Admin SDK. It is the ONLY code path that can create admin accounts, set custom
  claims, or modify other users' roles/status.
- **Data:** Cloud Firestore (rules in `firestore.rules`), Firebase Storage (rules in
  `storage.rules`), Firebase Authentication (Email/Password + Google).

## Required Vercel environment variables

| Variable | Scope | Value |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | build (public) | Firebase web config |
| `VITE_FIREBASE_AUTH_DOMAIN` | build (public) | Firebase web config |
| `VITE_FIREBASE_PROJECT_ID` | build (public) | Firebase web config |
| `VITE_FIREBASE_STORAGE_BUCKET` | build (public) | Firebase web config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | build (public) | Firebase web config |
| `VITE_FIREBASE_APP_ID` | build (public) | Firebase web config |
| `FIREBASE_SERVICE_ACCOUNT` | **server secret** | Full service-account JSON, single line |
| `SUPER_ADMIN_EMAIL` | server (optional) | Defaults to lexcorp0777@gmail.com |

`FIREBASE_SERVICE_ACCOUNT` alternative: `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` +
`FIREBASE_PRIVATE_KEY` (with `\n` escapes). Never prefix secrets with `VITE_`.

Set the variables for **Production AND Preview** so preview deployments work.

## Node runtime

`package.json` pins `"engines": { "node": "22.x" }`. Vercel reads this and runs both the
build and the serverless function on Node 22 (required by firebase-admin v14).
If your Vercel project setting overrides Node, set it to 22.x there too.

## Deploying rules

Rules are NOT deployed by Vercel. After any change:

```bash
npx firebase-tools deploy --only firestore:rules,storage --project <your-project-id>
```

or paste them in Firebase Console → Firestore/Storage → Rules → Publish.

## Local development

```bash
cp .env.example .env      # fill in Firebase web config
npm install
npm run dev
```

## Quality gates (run before every deploy)

```bash
npm run typecheck   # TypeScript strict mode — must be clean
npm run lint        # ESLint over src/ and api/ — must be clean
npm run build       # Production build — must be clean
npm run test:rules  # Firestore security-rules tests (needs Java 21+ for the emulator)
```

## Admin lifecycle (how it works)

1. Super Admin opens Admin → Users → Add Admin (email + optional name).
2. Frontend POSTs to `/api/admin-users` with the Super Admin's Firebase ID token.
3. The API verifies the token, then **idempotently**:
   - finds or creates the Firebase Auth user (race-safe against concurrent sign-ups),
   - sets custom claim `{ role: 'admin' }`,
   - batch-writes `users/{uid}` and `emailIndex/{email}` (repairs missing/orphaned docs),
   - returns a password-setup link, which the UI copies to the clipboard.
4. Demote / Disable use the same endpoint (`set-role`, `set-status`). Disable also disables
   the Firebase Auth account itself, blocking sign-in entirely.
5. When a promoted user's client detects `users/{uid}.role == 'admin'` but an old token,
   it force-refreshes the ID token once so the claim takes effect without re-login.

## Security model summary

- `role: 'admin'` custom claim — set only by the backend; recognized by Firestore AND
  Storage rules (Storage rules cannot read Firestore, so the claim is the source of truth).
- Super Admin is pinned by email in rules and backend; cannot be demoted, disabled, or deleted.
- Public writes (inquiries, reviews) are schema-validated in rules (allowed keys, sizes,
  forced `status`) to prevent abuse.
- All other collection writes require admin; `users`/`emailIndex` writes are locked down.
