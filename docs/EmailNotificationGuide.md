# Email & Notification Guide

This guide explains how the backend sends notifications and how to configure email behavior for local development and production.

## How the backend sends email

The API uses `server/services/emailService.ts` and `nodemailer`.

- `sendInviteEmail()` sends campaign invite notifications by email.
- `sendEmail()` is the shared helper that respects the configured mail mode.
- The backend uses `dotenv` in `server/index.ts`, so `.env` files work when starting the server with `npm run server`.

## Mail modes

The backend supports three modes via `MAIL_MODE`:

- `off` - Do not send email and do not mock the send.
- `mock` - Log pretend sends to the console, useful for local development and testing without SMTP.
- `smtp` - Send real emails through a configured SMTP server.

If `MAIL_MODE` is not set:

- `NODE_ENV=production` defaults to `smtp`.
- other environments default to `off`.

## Recommended local development setup

Use mock mode when you want to verify notification behavior without sending real email.

Example `.env` for local development:

```env
MAIL_MODE=mock
EMAIL_FROM=no-reply@battletech.local
```

Then start the server:

```bash
npm run server
```

When mail mode is `mock`, the server logs messages like:

- `[emailService] MAIL_MODE=mock; mock-send to ...`

This means the code path is exercised, but no external SMTP server is required.

## Test email flow

A smoke test script exists at `scripts/testEmail.ts`.

Run it with:

```bash
npx tsx scripts/testEmail.ts
```

This validates whether the email service is using mock mode or a properly configured SMTP transport.

## SMTP production setup

For real email delivery, set `MAIL_MODE=smtp` and configure the following environment variables:

- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `EMAIL_FROM` - sender address (defaults to `no-reply@battletech.local`)

Example production `.env`:

```env
NODE_ENV=production
MAIL_MODE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=example-user
SMTP_PASS=example-password
EMAIL_FROM=no-reply@battletech.example.com
```

If `MAIL_MODE` is `smtp` but the SMTP settings are incomplete, the service logs a warning and does not attempt delivery.

## Notification behavior

The server stores notifications in the JSON data store and optionally sends an email when invites are created.

- Notifications are persisted and available through `/api/users/me/notifications`.
- Campaign invite emails are created using `sendInviteEmail()`.
- For UI testing and workflows, use `MAIL_MODE=mock` locally.

## Summary

- Use `MAIL_MODE=mock` for safe local testing.
- Use `MAIL_MODE=smtp` only when SMTP credentials are configured.
- Keep `EMAIL_FROM` set to a recognizable sender address for production.
- See `server/services/emailService.ts` for the implementation details.
