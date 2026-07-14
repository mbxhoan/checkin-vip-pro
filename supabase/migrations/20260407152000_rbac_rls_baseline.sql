alter table public.companies enable row level security;
alter table public.company_domains enable row level security;
alter table public.company_subscriptions enable row level security;
alter table public.users enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_access_scopes enable row level security;
alter table public.events enable row level security;
alter table public.event_settings enable row level security;
alter table public.event_areas enable row level security;
alter table public.custom_field_templates enable row level security;
alter table public.language_defines enable row level security;
alter table public.media enable row level security;
alter table public.event_files enable row level security;
alter table public.landing_pages enable row level security;
alter table public.landing_page_submissions enable row level security;
alter table public.clients enable row level security;
alter table public.client_backups enable row level security;
alter table public.client_custom_field_values enable row level security;
alter table public.scanner_devices enable row level security;
alter table public.scan_offline_batches enable row level security;
alter table public.checkins enable row level security;
alter table public.reports enable row level security;
alter table public.report_runs enable row level security;
alter table public.legal_documents enable row level security;
alter table public.user_legal_acceptances enable row level security;

drop policy if exists companies_select on public.companies;
create policy companies_select
on public.companies
for select
using (
    public.current_user_has_permission('company.view', id)
);

drop policy if exists companies_insert on public.companies;
create policy companies_insert
on public.companies
for insert
with check (
    public.current_user_has_permission('company.create')
);

drop policy if exists companies_update on public.companies;
create policy companies_update
on public.companies
for update
using (
    public.current_user_has_permission('company.update', id)
)
with check (
    public.current_user_has_permission('company.update', id)
);

drop policy if exists companies_delete on public.companies;
create policy companies_delete
on public.companies
for delete
using (
    public.current_user_has_permission('company.update', id)
);

drop policy if exists company_domains_select on public.company_domains;
create policy company_domains_select
on public.company_domains
for select
using (
    public.current_user_has_permission('company.view', company_id)
    or public.current_user_has_permission('company.manage_settings', company_id)
);

drop policy if exists company_domains_write on public.company_domains;
create policy company_domains_write
on public.company_domains
for all
using (
    public.current_user_has_permission('company.manage_settings', company_id)
)
with check (
    public.current_user_has_permission('company.manage_settings', company_id)
);

drop policy if exists company_subscriptions_select on public.company_subscriptions;
create policy company_subscriptions_select
on public.company_subscriptions
for select
using (
    public.current_user_has_permission('company.view', company_id)
);

drop policy if exists company_subscriptions_write on public.company_subscriptions;
create policy company_subscriptions_write
on public.company_subscriptions
for all
using (
    public.current_user_has_permission('company.manage_settings', company_id)
)
with check (
    public.current_user_has_permission('company.manage_settings', company_id)
);

drop policy if exists users_select on public.users;
create policy users_select
on public.users
for select
using (
    public.current_user_id() = id
    or public.current_user_has_permission('user.view', default_company_id)
);

drop policy if exists users_insert on public.users;
create policy users_insert
on public.users
for insert
with check (
    public.current_user_has_permission('user.create', default_company_id)
);

drop policy if exists users_update on public.users;
create policy users_update
on public.users
for update
using (
    public.current_user_id() = id
    or public.current_user_has_permission('user.update', default_company_id)
)
with check (
    public.current_user_id() = id
    or public.current_user_has_permission('user.update', default_company_id)
);

drop policy if exists users_delete on public.users;
create policy users_delete
on public.users
for delete
using (
    public.current_user_has_permission('user.update', default_company_id)
);

drop policy if exists roles_select on public.roles;
create policy roles_select
on public.roles
for select
using (
    public.current_user_has_permission('role.view')
);

drop policy if exists roles_write on public.roles;
create policy roles_write
on public.roles
for all
using (
    public.current_user_has_permission('role.manage')
)
with check (
    public.current_user_has_permission('role.manage')
);

drop policy if exists permissions_select on public.permissions;
create policy permissions_select
on public.permissions
for select
using (
    public.current_user_has_permission('permission.view')
);

drop policy if exists permissions_write on public.permissions;
create policy permissions_write
on public.permissions
for all
using (
    public.current_user_has_permission('role.manage')
)
with check (
    public.current_user_has_permission('role.manage')
);

drop policy if exists role_permissions_select on public.role_permissions;
create policy role_permissions_select
on public.role_permissions
for select
using (
    public.current_user_has_permission('role.view')
);

drop policy if exists role_permissions_write on public.role_permissions;
create policy role_permissions_write
on public.role_permissions
for all
using (
    public.current_user_has_permission('role.manage')
)
with check (
    public.current_user_has_permission('role.manage')
);

drop policy if exists user_access_scopes_select on public.user_access_scopes;
create policy user_access_scopes_select
on public.user_access_scopes
for select
using (
    public.current_user_id() = user_id
    or public.current_user_has_permission('user.view', company_id, event_id)
);

drop policy if exists user_access_scopes_write on public.user_access_scopes;
create policy user_access_scopes_write
on public.user_access_scopes
for all
using (
    public.current_user_has_permission('user.assign_role', company_id, event_id)
)
with check (
    public.current_user_has_permission('user.assign_role', company_id, event_id)
);

drop policy if exists events_select on public.events;
create policy events_select
on public.events
for select
using (
    public.current_user_has_permission('event.view', company_id, id)
);

drop policy if exists events_write on public.events;
create policy events_write
on public.events
for all
using (
    public.current_user_has_permission('event.update', company_id, id)
)
with check (
    public.current_user_has_permission('event.update', company_id, id)
);

drop policy if exists event_settings_select on public.event_settings;
create policy event_settings_select
on public.event_settings
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event_settings.view', e.company_id, e.id)
    )
);

drop policy if exists event_settings_write on public.event_settings;
create policy event_settings_write
on public.event_settings
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event_settings.update', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event_settings.update', e.company_id, e.id)
    )
);

drop policy if exists event_areas_select on public.event_areas;
create policy event_areas_select
on public.event_areas
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event.view', e.company_id, e.id)
    )
);

drop policy if exists event_areas_write on public.event_areas;
create policy event_areas_write
on public.event_areas
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event.update', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event.update', e.company_id, e.id)
    )
);

drop policy if exists custom_field_templates_select on public.custom_field_templates;
create policy custom_field_templates_select
on public.custom_field_templates
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('custom_field.view', e.company_id, e.id)
    )
);

drop policy if exists custom_field_templates_write on public.custom_field_templates;
create policy custom_field_templates_write
on public.custom_field_templates
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('custom_field.manage', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('custom_field.manage', e.company_id, e.id)
    )
);

drop policy if exists language_defines_select on public.language_defines;
create policy language_defines_select
on public.language_defines
for select
using (
    coalesce(company_id, event_id) is not null
    and (
        public.current_user_has_permission('company.view', company_id)
        or public.current_user_has_permission('event.view', company_id, event_id)
    )
);

drop policy if exists language_defines_write on public.language_defines;
create policy language_defines_write
on public.language_defines
for all
using (
    coalesce(company_id, event_id) is not null
    and (
        public.current_user_has_permission('company.update', company_id)
        or public.current_user_has_permission('event.update', company_id, event_id)
    )
)
with check (
    coalesce(company_id, event_id) is not null
    and (
        public.current_user_has_permission('company.update', company_id)
        or public.current_user_has_permission('event.update', company_id, event_id)
    )
);

drop policy if exists media_select on public.media;
create policy media_select
on public.media
for select
using (
    public.current_user_has_permission('media.view', company_id, event_id)
);

drop policy if exists media_write on public.media;
create policy media_write
on public.media
for all
using (
    public.current_user_has_permission('media.upload', company_id, event_id)
)
with check (
    public.current_user_has_permission('media.upload', company_id, event_id)
);

drop policy if exists event_files_select on public.event_files;
create policy event_files_select
on public.event_files
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event.view', e.company_id, e.id)
    )
);

drop policy if exists event_files_write on public.event_files;
create policy event_files_write
on public.event_files
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event.media.manage', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('event.media.manage', e.company_id, e.id)
    )
);

drop policy if exists landing_pages_select on public.landing_pages;
create policy landing_pages_select
on public.landing_pages
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('landing_page.view', e.company_id, e.id)
    )
);

drop policy if exists landing_pages_write on public.landing_pages;
create policy landing_pages_write
on public.landing_pages
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and (
              public.current_user_has_permission('landing_page.create', e.company_id, e.id)
              or public.current_user_has_permission('landing_page.update', e.company_id, e.id)
              or public.current_user_has_permission('landing_page.publish', e.company_id, e.id)
          )
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and (
              public.current_user_has_permission('landing_page.create', e.company_id, e.id)
              or public.current_user_has_permission('landing_page.update', e.company_id, e.id)
              or public.current_user_has_permission('landing_page.publish', e.company_id, e.id)
          )
    )
);

drop policy if exists landing_page_submissions_select on public.landing_page_submissions;
create policy landing_page_submissions_select
on public.landing_page_submissions
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('landing_page.view', e.company_id, e.id)
    )
);

drop policy if exists landing_page_submissions_insert on public.landing_page_submissions;
create policy landing_page_submissions_insert
on public.landing_page_submissions
for insert
with check (true);

drop policy if exists clients_select on public.clients;
create policy clients_select
on public.clients
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('client.view', e.company_id, e.id)
    )
);

drop policy if exists clients_write on public.clients;
create policy clients_write
on public.clients
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and (
              public.current_user_has_permission('client.create', e.company_id, e.id)
              or public.current_user_has_permission('client.update', e.company_id, e.id)
              or public.current_user_has_permission('client.delete', e.company_id, e.id)
          )
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and (
              public.current_user_has_permission('client.create', e.company_id, e.id)
              or public.current_user_has_permission('client.update', e.company_id, e.id)
              or public.current_user_has_permission('client.delete', e.company_id, e.id)
          )
    )
);

drop policy if exists client_backups_select on public.client_backups;
create policy client_backups_select
on public.client_backups
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('client.view', e.company_id, e.id)
    )
);

drop policy if exists client_backups_write on public.client_backups;
create policy client_backups_write
on public.client_backups
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('client.import', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('client.import', e.company_id, e.id)
    )
);

drop policy if exists client_custom_field_values_select on public.client_custom_field_values;
create policy client_custom_field_values_select
on public.client_custom_field_values
for select
using (
    exists (
        select 1
        from public.clients c
        join public.events e on e.id = c.event_id
        where c.id = client_id
          and public.current_user_has_permission('client.view', e.company_id, e.id)
    )
);

drop policy if exists client_custom_field_values_write on public.client_custom_field_values;
create policy client_custom_field_values_write
on public.client_custom_field_values
for all
using (
    exists (
        select 1
        from public.clients c
        join public.events e on e.id = c.event_id
        where c.id = client_id
          and public.current_user_has_permission('client.update', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.clients c
        join public.events e on e.id = c.event_id
        where c.id = client_id
          and public.current_user_has_permission('client.update', e.company_id, e.id)
    )
);

drop policy if exists scanner_devices_select on public.scanner_devices;
create policy scanner_devices_select
on public.scanner_devices
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('checkin.view', e.company_id, e.id)
    )
);

drop policy if exists scanner_devices_write on public.scanner_devices;
create policy scanner_devices_write
on public.scanner_devices
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('checkin.run', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('checkin.run', e.company_id, e.id)
    )
);

drop policy if exists scan_offline_batches_select on public.scan_offline_batches;
create policy scan_offline_batches_select
on public.scan_offline_batches
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('checkin.run', e.company_id, e.id)
    )
);

drop policy if exists scan_offline_batches_write on public.scan_offline_batches;
create policy scan_offline_batches_write
on public.scan_offline_batches
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('checkin.run', e.company_id, e.id)
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('checkin.run', e.company_id, e.id)
    )
);

drop policy if exists checkins_select on public.checkins;
create policy checkins_select
on public.checkins
for select
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and public.current_user_has_permission('checkin.view', e.company_id, e.id)
    )
);

drop policy if exists checkins_write on public.checkins;
create policy checkins_write
on public.checkins
for all
using (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and (
              public.current_user_has_permission('checkin.run', e.company_id, e.id)
              or public.current_user_has_permission('checkin.manage', e.company_id, e.id)
          )
    )
)
with check (
    exists (
        select 1
        from public.events e
        where e.id = event_id
          and (
              public.current_user_has_permission('checkin.run', e.company_id, e.id)
              or public.current_user_has_permission('checkin.manage', e.company_id, e.id)
          )
    )
);

drop policy if exists reports_select on public.reports;
create policy reports_select
on public.reports
for select
using (
    public.current_user_has_permission('report.view', company_id, event_id)
);

drop policy if exists reports_write on public.reports;
create policy reports_write
on public.reports
for all
using (
    public.current_user_has_permission('report.render', company_id, event_id)
    or public.current_user_has_permission('report.export', company_id, event_id)
)
with check (
    public.current_user_has_permission('report.render', company_id, event_id)
    or public.current_user_has_permission('report.export', company_id, event_id)
);

drop policy if exists report_runs_select on public.report_runs;
create policy report_runs_select
on public.report_runs
for select
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
          and public.current_user_has_permission('report.view', r.company_id, r.event_id)
    )
);

drop policy if exists report_runs_write on public.report_runs;
create policy report_runs_write
on public.report_runs
for all
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
          and public.current_user_has_permission('report.render', r.company_id, r.event_id)
    )
)
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
          and public.current_user_has_permission('report.render', r.company_id, r.event_id)
    )
);

drop policy if exists legal_documents_select on public.legal_documents;
create policy legal_documents_select
on public.legal_documents
for select
using (is_active);

drop policy if exists legal_documents_write on public.legal_documents;
create policy legal_documents_write
on public.legal_documents
for all
using (
    public.current_user_has_permission('legal.view')
)
with check (
    public.current_user_has_permission('legal.view')
);

drop policy if exists user_legal_acceptances_select on public.user_legal_acceptances;
create policy user_legal_acceptances_select
on public.user_legal_acceptances
for select
using (
    public.current_user_id() = user_id
    or public.current_user_has_permission('legal.view')
);

drop policy if exists user_legal_acceptances_write on public.user_legal_acceptances;
create policy user_legal_acceptances_write
on public.user_legal_acceptances
for insert
with check (
    public.current_user_id() = user_id
);
