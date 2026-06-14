# Backend Review

## Scope

Reviewed the FastAPI backend across `controllers/`, `services/`, `repositories/`, `tables/`, `DTOs/`, `utils/`, `main.py`, `config.py`, `migrate.py`, and `seed_admin.py`.

This review focuses on:

- correctness and behavioural bugs
- security and privilege boundaries
- edge cases and failure handling
- unnecessary or misleading code
- backend best-practice gaps that are likely to cause production issues

## Validation Notes

- Static code review completed across the whole backend.
- I attempted a runtime/syntax validation with `uv run python -m compileall .`, but it failed due a local sandbox/cache permission issue outside the repo (`/Users/chaduvulavarun/.cache/uv/...`), so this report is based on code inspection rather than a successful import/test run.
- No automated tests are present in this repository, so there is no regression coverage for auth flows, uploads, or repository/service behaviour.

## Bugs And Findings

### Critical

1. Client-controlled signup can create admin accounts
   - Files: `DTOs/auth_DTO.py:7-13`, `services/auth_service.py:55-61`
   - `SignupRequest` accepts arbitrary `role` and `status`, and `AuthService.signup()` persists both directly.
   - Any public caller can submit `role="admin"` and create an admin user. Even if OTP verification is required before login, that is still a direct privilege escalation path.
   - `status` is also client-controlled, which means the server is trusting authorization-sensitive fields from an unauthenticated request.

2. Password reset keeps all existing sessions alive
   - Files: `services/auth_service.py:159-170`, `repositories/refresh_token_repository.py:31-35`
   - `reset_password()` updates the password but does not revoke existing refresh tokens.
   - Anyone holding a previously issued refresh token can continue minting new access tokens after the password has been changed.
   - This is a real account-takeover persistence bug, not just a best-practice gap.

3. Hard-coded admin credentials in source
   - File: `seed_admin.py:11-23`
   - The repo contains a fixed admin email and password (`admin123@gmail.com` / `admin@123`).
   - If this script is ever run in any shared or production-like environment, it creates a predictable privileged account.
   - Secrets and bootstrap credentials must never be committed in code.

### High

4. OTP verification trusts any HTTP 200 response as success
   - File: `services/auth_service.py:36-47`
   - `_verify_otp_webhook()` returns `True` solely when the remote service responds with status `200`, without validating the response body.
   - If the webhook returns `200` for malformed requests, partial failures, or “invalid OTP” responses encoded in JSON, the backend will incorrectly mark users as verified and allow password resets.
   - The inline comment already hints that this behaviour is only an assumption.

5. Signup succeeds even when OTP delivery fails
   - Files: `services/auth_service.py:27-35`, `services/auth_service.py:66-76`
   - `_send_otp_webhook()` swallows request failures and only prints an error. `signup()` still creates the user and issues access/refresh tokens.
   - This leaves users in a half-created, unverified state with no guarantee they can ever complete verification.
   - It also means operational email outages degrade silently instead of surfacing a clear API failure.

6. The server does not initialize the database schema on startup
   - Files: `DataBase/core.py:35-45`, `main.py:43-49`, `main.py:74-87`
   - `init_db()` exists and its own docstring says it should be called on startup, but `main.py` never calls it.
   - `seed_admin` is imported in `main.py` but never used.
   - On a fresh deployment, the API can boot without required tables and then fail at request time depending on whether `migrate.py` was run manually.

7. Uploaded document validation is silently bypassed after the database row is created
   - Files: `services/sell_bike_service.py:32-41`, `services/sell_bike_service.py:54-60`, `utils/upload.py:81-100`
   - The service only checks that a file object and filename exist before creating the row.
   - `save_sell_bike_document()` silently returns `None` for invalid extensions or oversized files, but the request still succeeds and the row remains stored with `invoice_url`/`rc_card_url = None`.
   - For both `"new"` and `"existing"` flows, this allows logically invalid submissions to be persisted even though the endpoint claims the document is required.

8. Bike creation persists rows even when all uploaded images are invalid
   - Files: `controllers/bike_controller.py:71-88`, `services/bike_service.py:27-36`, `utils/upload.py:24-50`
   - The controller enforces image count only from submitted form parts, not from successfully saved files.
   - `save_bike_images()` silently skips unsupported or oversized files; `create_bike_with_uploads()` still returns success with a persisted bike.
   - For ads, a request can satisfy the “exactly 1 image” check yet store zero images if the uploaded file is invalid.

9. Spare-part creation/update has the same silent-upload failure bug
   - Files: `services/spare_part_service.py:12-21`, `services/spare_part_service.py:37-46`, `utils/upload.py:53-78`
   - Invalid or oversized images are silently dropped, but the API still returns success.
   - On update, existing images are deleted before the new files are validated and saved, so a user can unintentionally wipe all images by uploading only invalid replacements.

10. Default JWT secret is an insecure production fallback
    - File: `config.py:9-15`
    - `JWT_SECRET_KEY` defaults to `"change-me-in-production"`.
    - If deployment configuration is incomplete, the service will start and mint valid tokens with a publicly guessable secret.
    - For security-sensitive config like JWT signing keys, fail-fast is safer than silently using a weak default.

### Medium

11. Admin user creation and admin user update accept unrestricted role/status values
    - Files: `DTOs/user_DTO.py:20-32`, `services/user_service.py:24-32`, `services/user_service.py:44-47`
    - `UserCreateDTO` and `AdminUserUpdateDTO` do not constrain `role` or `status`.
    - The service writes these values directly, allowing invalid states like `"superadmin"`, `"disabledd"`, or any arbitrary string.
    - This creates data integrity drift and weakens authorization checks that assume a known role set.

12. User updates can write any attribute without a repository allowlist
    - File: `repositories/user_repository.py:35-39`
    - `update()` blindly applies every key via `setattr`.
    - It is currently fed from limited DTOs, but the repository API itself is unsafe and invites accidental writes to sensitive fields like `password`, `is_verified`, or future internal columns.
    - Repository methods should enforce an explicit write allowlist.

13. Refresh flow does not validate current user state before issuing new tokens
    - File: `services/auth_service.py:98-124`
    - The refresh path validates the token row but does not load the user or verify `status` / `is_verified`.
    - An inactive user can still receive fresh access tokens until downstream route auth blocks usage.
    - This is inconsistent with the login path and makes account suspension weaker than intended.

14. Lead endpoint logs bearer tokens and email HTML payloads at DEBUG level
    - Files: `main.py:6-19`, `main.py:43-49`, `controllers/lead_controller.py:21-31`
    - Root logging is forced to `DEBUG`, and `/leads/capture` logs the full `Authorization` header plus the user/admin HTML payloads.
    - That leaks bearer tokens and potentially sensitive customer content to logs.
    - This is both a security and privacy issue.

15. Bike creation permissions do not match the documented intent
    - Files: `main.py:76-77`, `controllers/bike_controller.py:29-31`
    - `main.py` comments say bike creation is “admin-only”, but the endpoint uses `CurrentUser`, not `RequireAdmin`.
    - Either the comment is wrong or the route protection is wrong. In its current state, any authenticated user can create, update, and delete bikes.
    - If bikes are inventory data rather than user-owned resources, this is a major authorization mismatch.

16. API port configuration is internally inconsistent
    - Files: `config.py:15`, `main.py:107`
    - `API_BASE_URL` defaults to `http://localhost:8000`, while the application runs on port `8001`.
    - Any feature that uses `API_BASE_URL` to generate links will point to the wrong server unless explicitly overridden.
    - This is currently dormant because `API_BASE_URL` appears unused, but it is still a configuration bug.

17. Database bootstrap uses nonstandard lowercase env names
    - File: `DataBase/core.py:11-21`
    - The fallback connection builder reads `user`, `password`, `host`, `port`, `dbname` instead of conventional uppercase env names.
    - That increases misconfiguration risk and diverges from the `Settings` object, which separately reads `DATABASE_URL`.
    - It also splits configuration logic across two unrelated patterns.

### Low

18. Several modules and imports are dead or misleading
   - Files:
     - `utils/send_email.py:1-19`
     - `services/get_bike_data.py` (empty file)
     - `controllers/bike_controller.py:2`
     - `controllers/spare_part_controller.py:1,4`
     - `controllers/auth_controller.py:18`
     - `DTOs/bike_DTO.py:4-5`
     - `DTOs/sell_bike_DTO.py:2-3`
     - `services/spare_part_service.py:3`
   - `utils/send_email.py` is not wired in and contains placeholder Mailgun credentials.
   - There are multiple unused imports (`HTMLResponse`, `HTTPException`, `UpdateSparePartRequest`, `User`, `field_validator`, `settings`).
   - Empty or placeholder files reduce signal and make the codebase look less trustworthy than it is.

19. `_safe_filename()` is unused
   - File: `utils/upload.py:15-21`
   - The helper is never called because filenames are replaced with UUIDs.
   - Keeping dead sanitization code suggests a path that no longer exists and makes the upload flow harder to reason about.

20. List endpoints require authentication even for public catalog-style resources
   - Files: `controllers/bike_controller.py:13-23`, `controllers/spare_part_controller.py:10-17`
   - This may be intentional, but for a marketplace-like product it is atypical and should be verified.
   - If this backend is meant to support public browsing, the current design creates unnecessary friction and token dependency for read-only traffic.

## Edge Cases Missing Proper Handling

1. No transaction boundaries around “DB row + file upload” workflows
   - Files: `services/bike_service.py:27-36`, `services/sell_bike_service.py:43-60`, `services/spare_part_service.py:12-21`
   - Rows are committed before file persistence finishes.
   - If disk writes fail midway, the database can contain incomplete records.
   - These flows should either validate files first or use a compensating rollback/cleanup strategy.

2. Upload validation does not distinguish user error from server error
   - File: `utils/upload.py:24-100`
   - Unsupported extensions and oversize files are silently ignored instead of returning a `4xx` response.
   - That makes debugging difficult for clients and causes data-quality issues.

3. No logout / token revocation endpoint
   - Relevant files: `controllers/auth_controller.py`, `repositories/refresh_token_repository.py`
   - Refresh tokens are stored and rotated, but there is no explicit logout path for current-session revocation.
   - This is not a bug by itself, but it is an incomplete auth lifecycle.

4. No uniqueness or normalization for user phone numbers
   - Files: `tables/users.py`, `DTOs/user_DTO.py`, `DTOs/auth_DTO.py`
   - The system accepts any `phone` string and does not normalize format.
   - This will create inconsistent data and weak user-search/admin support later.

5. Error handling is inconsistent and mostly print-based
   - Files: `services/auth_service.py:27-47`, `DataBase/core.py:73-86`, `seed_admin.py:14-37`, `migrate.py:7-59`, `utils/send_email.py:4-19`
   - Operational failures are printed rather than logged with structure and context.
   - In production this makes alerting and root-cause analysis unnecessarily hard.

## Unnecessary Or Misleading Code

- `seed_admin` is imported in `main.py` but never used.
- `CreateBikeRequest` exists, but the public creation path uses multipart form handling instead of this DTO.
- `UpdateSparePartRequest` exists, but the controller builds a manual `dict` instead of using the DTO.
- `utils/send_email.py` appears abandoned and should be removed or wired properly.
- `services/get_bike_data.py` is empty and should be deleted unless work is planned immediately.

## Recommended Fix Order

1. Remove client control over `role` and `status` in signup, and rotate any compromised/admin credentials.
2. Revoke all refresh tokens on password reset and consider revoking on status changes as well.
3. Make OTP verification depend on an explicit success signal from the webhook response body.
4. Fix all upload flows so invalid files raise `4xx` before persisting database rows.
5. Decide the intended authorization model for bike inventory and enforce it consistently.
6. Fail startup when required secrets/config are missing instead of using insecure defaults.
7. Add tests for signup, OTP verification, refresh rotation, password reset, and upload validation.

## Suggested Minimum Test Coverage

- signup rejects any client-supplied admin role
- login fails for unverified users and inactive users
- refresh rejects revoked tokens and inactive users
- password reset revokes prior refresh tokens
- bike/spare-part/sell-bike uploads reject invalid extensions and oversize files
- spare-part image replacement does not delete existing images when replacement validation fails
- admin-only routes reject regular users
