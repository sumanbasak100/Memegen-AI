# Security Policy & Credential Isolation

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

---

## 🔒 Secret Scanning & Credential Safety

This repository is configured to comply strictly with **GitHub Secret Scanning** and enterprise credential isolation standards.

1. **Server-Side Isolation**: All Google Gemini API keys are processed strictly on the Express backend (`server.ts`) via environment variables (`process.env.GEMINI_API_KEY`). They are never bundled into the client distribution or exposed in browser network payloads.
2. **Git Cleanliness**:
   - `.env` and `.env.*` files containing developer secrets are ignored in `.gitignore`.
   - `.env.example` contains only sanitized placeholder templates.
   - `firebase-applet-config.json` uses environment-resolved keys (`ENV_VITE_FIREBASE_API_KEY`) so that no raw API credentials reside in the git history or working tree.
3. **Firestore Security Rules**:
   - Access to Firestore documents is bounded by strict Attribute-Based Access Control (ABAC) in `firestore.rules`.
   - Write actions require authentication matching `request.auth.uid`.
   - Public like counter increments are restricted strictly to the `likesCount` property.

---

## Reporting a Vulnerability

If you discover a security vulnerability within MemeGen AI, please send an advisory email to [security@memegen.example.com](mailto:sumanbasak100@gmail.com).

Please include:
- Description of the vulnerability.
- Steps to reproduce.
- Potential impact.

We will acknowledge receipt within 24 hours and provide a remediation timeline.
