# Workspace Clients Parity Checklist

Tai lieu nay cover client CRUD, backup inventory, va import/export queue hooks trong workspace lane.

## Module

- Ten module: Client workspace
- Owner: Codex
- Phase: 3
- Legacy references: `admin.clients.*`
- New routes/screens: `/workspace/clients`

## 1. Functional parity

- [x] Client create/update screen is available in the new workspace route
- [x] Client backup inventory is visible for import/export history
- [x] Import and export jobs can be queued from the UI
- [ ] Client delete flow
- [ ] Bulk import mapping and validation parity
- [ ] Bulk export execution parity

## 2. Data parity

- [x] Read-model uses `public.clients`, `public.client_backups`, and `public.background_jobs`
- [x] Scope-aware event resolution respects company and event grants
- [ ] Legacy-to-new parity query comparison for client totals
- [ ] Legacy-to-new parity query comparison for backup totals

## 3. RBAC parity

- [x] Client read access is gated by `client.view`
- [x] Client mutation access is gated by `client.create` and `client.update`
- [x] Queue actions are gated by `client.import` and `client.export`
- [ ] Delete permission and soft-delete policy

## 4. UX parity

- [x] Dedicated client workspace screen exists
- [x] Client workspace no longer depends on the NextAdmin template surface
- [ ] Bulk import assistant
- [ ] Bulk export job detail view

## 5. Integration parity

- [x] Workspace route pulls auth bootstrap and RBAC bootstrap server-side
- [x] Server actions write through the service-role layer
- [ ] End-to-end verification against production Supabase auth/session
- [ ] Worker execution and retry smoke test

## 6. Release decision

- [x] Ready for internal UAT
- [ ] Ready for pilot cutover
- [ ] Ready for full cutover

## Notes

- The client workspace is live, but the worker-backed import/export flows still need production parity.
