# Terra-Scape Equipment Tracking & Maintenance (Beta)

Next.js App Router + Prisma + Postgres implementation for:
- Auth + role-based access
- Equipment registry
- Team leader assignment
- Inspection templates (basic CRUD API)
- Inspection flow with stoplight (GREEN/YELLOW/RED)
- Automatic work order creation for RED inspections
- Notification settings + cron scan endpoint

## Local development

1. Copy env values:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Apply migrations:
   ```bash
   npm run prisma:deploy
   ```
5. Seed initial roles + notification settings:
   ```bash
   npm run prisma:seed
   ```
6. Start app:
   ```bash
   npm run dev
   ```
7. Login with seeded admin account:
   - `admin@terrascape.local`
   - `ChangeMe123!`

## Deployment

1. Provision Postgres and set `DATABASE_URL`.
2. Set runtime env vars:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `APP_URL`
3. Build and start:
   ```bash
   npm ci
   npm run prisma:generate
   npm run prisma:deploy
   npm run build
   npm start
   ```
4. Configure a cron job (or platform scheduler) to invoke:
   - `GET /api/cron/notifications`

## API highlights

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/equipment`
- `POST /api/team-leaders`
- `POST /api/templates`
- `PATCH /api/templates`
- `DELETE /api/templates?id=<id>`
- `POST /api/inspections` (creates work order for RED)
- `GET /api/cron/notifications`

## Milestone PR slicing plan

1. Project setup + DB
2. Auth/roles
3. Equipment/team leaders
4. Templates
5. Inspections + red automation
6. Notifications + cron endpoints

This repo currently includes all milestones in one implementation pass.
