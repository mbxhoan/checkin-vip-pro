# Audience Parity Checklist

Tai lieu nay cover client intake, check-in runtime, scanner devices, va report catalog trong audience lane.

## Module

- Ten module: Audience operations
- Owner: Codex
- Phase: 3
- Legacy references: `admin.clients.*`, `admin.checkins.*`, `admin.reports.*`, scan runtime routes
- New routes/screens: `/audience`

## 1. Functional parity

- [x] Audience lane co read-model that show clients, check-ins, devices, and reports
- [x] Scope-aware event resolution respects company and event grants
- [x] Check-in and client rows are visible from the new shell lane
- [x] Client create/update flows now live in the dedicated workspace route
- [x] Client import/export flows now live in the dedicated workspace route
- [x] Check-in operator runtime screens now live in the dedicated runtime route
- [x] Offline sync surface now lives in the dedicated sync route
- [ ] Offline reset and replay flows
- [x] Report screen now lives in the dedicated reports route
- [ ] Report drill-down and export flows

## 2. Data parity

- [x] Read-model queries use public.clients, public.checkins, public.scanner_devices, and public.reports
- [x] Company scope expands to child events before fetching audience records
- [ ] Legacy-to-new parity query comparison for client totals
- [ ] Legacy-to-new parity query comparison for check-in totals
- [ ] Legacy-to-new parity query comparison for report totals

## 3. RBAC parity

- [x] Audience read-model is gated by `client.view`, `checkin.view`, or `report.view`
- [x] Scope filtering respects system, company, and event access
- [x] Mutation permissions for client and check-in actions are enforced in dedicated routes
- [ ] Scanner device management permissions

## 4. UX parity

- [x] Audience shell no longer shows the NextAdmin template
- [x] Operational snapshot uses live data instead of placeholder widgets
- [x] Dedicated client workspace screen
- [x] Dedicated check-in runtime screen
- [x] Dedicated offline sync screen
- [x] Dedicated report screen

## 5. Integration parity

- [x] Shell routes and template vault still keep demo components preserved
- [x] Audience page pulls auth bootstrap and RBAC bootstrap server-side
- [ ] End-to-end verification against production Supabase auth/session
- [ ] Backfill and cutover smoke test for audience datasets

## 6. Release decision

- [x] Ready for internal UAT
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- This module remains a read-model overview, but the mutating and operator workflows now live in dedicated routes.
- The remaining parity work is now concentrated in the new module-specific checklists.
