# Check-in Runtime Parity Checklist

Tai lieu nay cover check-in runtime, scanner devices, va offline sync trong audience lane.

## Module

- Ten module: Check-in runtime
- Owner: Codex
- Phase: 3
- Legacy references: `admin.checkins.*`, scan runtime routes, offline sync routes
- New routes/screens: `/checkin`, `/sync-offline`

## 1. Functional parity

- [x] Check-in scan screen is available in the new runtime route
- [x] Offline sync queue is available in a dedicated sync route
- [x] Check-in rows can be created from registration code or client record
- [x] Device heartbeat and sync timestamps are visible
- [ ] Check-in delete or revert flow
- [ ] Offline reset and replay flow

## 2. Data parity

- [x] Read-model uses `public.clients`, `public.checkins`, `public.scanner_devices`, `public.scan_offline_batches`, and `public.background_jobs`
- [x] Scope-aware event resolution respects company and event grants
- [ ] Legacy-to-new parity query comparison for check-in totals
- [ ] Legacy-to-new parity query comparison for offline batch totals

## 3. RBAC parity

- [x] Check-in runtime access is gated by `checkin.view`
- [x] Check-in execution is gated by `checkin.run`
- [x] Offline sync bridge can reuse `checkin.run` and `checkin.manage`
- [ ] Device management permission model

## 4. UX parity

- [x] Dedicated check-in runtime screen exists
- [x] Dedicated offline sync screen exists
- [x] Runtime and sync routes no longer depend on the NextAdmin template surface
- [ ] Scanner device management screen
- [ ] Operator reset and replay assistant

## 5. Integration parity

- [x] Check-in routes pull auth bootstrap and RBAC bootstrap server-side
- [x] Server actions write through the service-role layer
- [ ] End-to-end verification against production Supabase auth/session
- [ ] Worker execution and retry smoke test

## 6. Release decision

- [x] Ready for internal UAT
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- The runtime and offline sync surfaces are live, but reset/replay and worker-backed reconciliation still need finish work.
