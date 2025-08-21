# Tooljet: Built-in Email Notification API

## Overview

This module implements a built-in email notification API for ToolJet, allowing you to send emails to one or multiple recipients via a simple HTTP POST request. It is designed for easy integration and secure configuration using environment variables.

**Implementation Details:**
- The API endpoint is `/asdi/email/send` and accepts a JSON payload with `to`, `subject`, and `body` fields.
- The request payload is validated using NestJS DTOs and `ValidationPipe`, ensuring only expected fields are processed and all others are rejected.
- The `to` field supports both a single email address (string) and multiple addresses (array).
- SMTP credentials are loaded from a local `.env` file in the module directory, which is ignored by git for security.
- Email sending is implemented with [nodemailer](https://nodemailer.com/), a robust Node.js library for SMTP.
- The service normalizes the recipient list, sends the email, and returns a clear response object indicating success or error, including the message ID and a human-readable message.
- All error handling and validation are performed server-side, and the response schema is consistent for both success and failure cases.

## Features
- Send emails to one or multiple recipients
- Request payload validation using DTOs and NestJS ValidationPipe
- Secure handling of SMTP credentials via `.env` (not tracked by git)
- Clear response schema for success and error cases

## Folder Structure
```
server/src/modules/asdi/
├── .env
├── controllers/
│   └── email.controller.ts
├── dto/
│   ├── email.dto.ts
│   └── email-response.dto.ts
├── services/
│   └── email.service.ts
├── module.ts
```

## Process Flow
1. **Request**: Client sends a POST request to `/asdi/email/send` with a JSON body containing `to`, `subject`, and `body`.
2. **Validation**: The controller uses `SendEmailDto` and a `ValidationPipe` to ensure only valid and expected fields are accepted.
   - `to` can be a string or an array of email addresses.
   - Extra fields are stripped or rejected.
3. **Service**: The service loads SMTP credentials from `.env`, normalizes the `to` field, and sends the email using Nodemailer.
4. **Response**: The service returns an `EmailResponseDto`:
   - On success: `{ id, status: 'OK', message }`
   - On error: `{ status: 'Error', message }`


## Example Request
```json
{
  "to": ["user1@example.com", "user2@example.com"],
  "subject": "Test Email",
  "body": "Hello from ToolJet!"
}
```
Or for a single recipient:
```json
{
  "to": "user1@example.com",
  "subject": "Test Email",
  "body": "Hello from ToolJet!"
}
```

## Example Response
Success:
```json
{
  "id": "<messageId>",
  "status": "OK",
  "message": "Successfully sent email to user1@example.com, user2@example.com"
}
```
Error:
```json
{
  "status": "Error",
  "message": "Email sending failed to user1@example.com: <error message>"
}
```

## Setup & Usage
1. Add your SMTP credentials to `server/src/modules/asdi/.env`:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your_email@gmail.com
  SMTP_PASS=your_app_password
  SMTP_FROM=noreply@tooljet.io
  ```
2. Build and run the server (Docker):
  ```bash
  docker compose build server
  docker compose up server
  ```
3. Send a POST request to `/asdi/email/send` with the required payload.

### Sample cURL Command

```
curl --location 'http://localhost:3000/api/asdi/email/send' \
--header 'Content-Type: application/json' \
--data-raw '{
   "to": "user1@example.com",
   "subject": "Test Subject",
   "body": "Hello from ToolJet!"
}'
```

## Notes
- The `.env` file is ignored by git for security.
- The module supports both single and multiple recipients.
- All validation and error handling is performed server-side.
- Email sending is implemented with [nodemailer](https://nodemailer.com/).

