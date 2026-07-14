create or replace function public.current_user_id()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
    select u.id
    from public.users u
    where u.auth_user_id = auth.uid()
    limit 1
$$;

create or replace function public.get_user_role_keys(p_user_id bigint)
returns text[]
language sql
stable
security definer
set search_path = public
as $$
with user_row as (
    select u.is_super_admin
    from public.users u
    where u.id = p_user_id
),
role_rows as (
    select distinct r.key
    from public.user_access_scopes uas
    join public.roles r on r.id = uas.role_id
    where uas.user_id = p_user_id
      and uas.membership_status = 'active'
)
select coalesce(
    case
        when exists (select 1 from user_row where is_super_admin) then (
            select array_agg(r.key order by r.key)
            from public.roles r
            where r.is_active
        )
        else (
            select array_agg(role_rows.key order by role_rows.key)
            from role_rows
        )
    end,
    array[]::text[]
);
$$;

create or replace function public.get_user_permission_keys(p_user_id bigint)
returns text[]
language sql
stable
security definer
set search_path = public
as $$
with user_row as (
    select u.is_super_admin
    from public.users u
    where u.id = p_user_id
),
permission_rows as (
    select distinct p.key
    from public.user_access_scopes uas
    join public.role_permissions rp on rp.role_id = uas.role_id
    join public.permissions p on p.id = rp.permission_id
    where uas.user_id = p_user_id
      and uas.membership_status = 'active'
)
select coalesce(
    case
        when exists (select 1 from user_row where is_super_admin) then (
            select array_agg(p.key order by p.key)
            from public.permissions p
        )
        else (
            select array_agg(permission_rows.key order by permission_rows.key)
            from permission_rows
        )
    end,
    array[]::text[]
);
$$;

create or replace function public.get_accessible_company_ids(p_user_id bigint)
returns bigint[]
language sql
stable
security definer
set search_path = public
as $$
select case
    when exists (
        select 1
        from public.users u
        where u.id = p_user_id
          and u.is_super_admin
    ) then null
    else coalesce(
        (
            select array_agg(scope_rows.company_id order by scope_rows.company_id)
            from (
                select distinct uas.company_id
                from public.user_access_scopes uas
                where uas.user_id = p_user_id
                  and uas.membership_status = 'active'
                  and uas.scope_type in ('company', 'event')
                  and uas.company_id is not null
            ) scope_rows
        ),
        array[]::bigint[]
    )
end;
$$;

create or replace function public.get_accessible_event_ids(
    p_user_id bigint,
    p_company_id bigint default null
)
returns bigint[]
language sql
stable
security definer
set search_path = public
as $$
select case
    when exists (
        select 1
        from public.users u
        where u.id = p_user_id
          and u.is_super_admin
    ) then null
    else coalesce(
        (
            select array_agg(scope_rows.event_id order by scope_rows.event_id)
            from (
                select distinct uas.event_id
                from public.user_access_scopes uas
                where uas.user_id = p_user_id
                  and uas.membership_status = 'active'
                  and uas.scope_type = 'event'
                  and uas.event_id is not null
                  and (
                      p_company_id is null
                      or uas.company_id = p_company_id
                  )
            ) scope_rows
        ),
        array[]::bigint[]
    )
end;
$$;

create or replace function public.get_user_access_scopes(p_user_id bigint)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
select coalesce(
    jsonb_agg(
        jsonb_build_object(
            'scopeType', uas.scope_type,
            'companyId', uas.company_id,
            'eventId', uas.event_id,
            'membershipStatus', uas.membership_status,
            'roleKey', r.key,
            'roleName', r.name,
            'defaultScope', r.default_scope
        )
        order by uas.created_at, uas.id
    ),
    '[]'::jsonb
)
from public.user_access_scopes uas
join public.roles r on r.id = uas.role_id
where uas.user_id = p_user_id;
$$;

create or replace function public.user_has_scope(
    p_user_id bigint,
    p_scope_type public.app_scope_type,
    p_company_id bigint default null,
    p_event_id bigint default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select coalesce(
    exists (
        select 1
        from public.users u
        where u.id = p_user_id
          and u.is_super_admin
    ),
    false
)
or exists (
    select 1
    from public.user_access_scopes uas
    where uas.user_id = p_user_id
      and uas.membership_status = 'active'
      and (
          uas.scope_type = 'system'
          or (
              uas.scope_type = 'company'
              and p_scope_type in ('company', 'event')
              and p_company_id is not null
              and uas.company_id = p_company_id
          )
          or (
              uas.scope_type = 'event'
              and p_scope_type = 'event'
              and p_company_id is not null
              and p_event_id is not null
              and uas.company_id = p_company_id
              and uas.event_id = p_event_id
          )
          or (
              uas.scope_type = 'self'
              and p_scope_type = 'self'
          )
      )
);
$$;

create or replace function public.user_has_permission(
    p_user_id bigint,
    p_permission_key text,
    p_company_id bigint default null,
    p_event_id bigint default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select coalesce(
    exists (
        select 1
        from public.users u
        where u.id = p_user_id
          and u.is_super_admin
    ),
    false
)
or (
    p_permission_key = any(public.get_user_permission_keys(p_user_id))
    and case
        when p_event_id is not null then public.user_has_scope(p_user_id, 'event', p_company_id, p_event_id)
        when p_company_id is not null then public.user_has_scope(p_user_id, 'company', p_company_id, null)
        else true
    end
);
$$;

create or replace function public.current_user_has_permission(
    p_permission_key text,
    p_company_id bigint default null,
    p_event_id bigint default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
select case
    when public.current_user_id() is null then false
    else public.user_has_permission(
        public.current_user_id(),
        p_permission_key,
        p_company_id,
        p_event_id
    )
end;
$$;

create or replace function public.get_user_rbac_context(p_user_id bigint)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with user_row as (
    select
        u.id,
        u.auth_user_id,
        coalesce(u.display_name, u.full_name, u.email) as display_name,
        u.default_company_id,
        u.is_super_admin
    from public.users u
    where u.id = p_user_id
)
select jsonb_build_object(
    'userId', user_row.id,
    'authUserId', user_row.auth_user_id,
    'displayName', user_row.display_name,
    'defaultCompanyId', user_row.default_company_id,
    'isSuperAdmin', user_row.is_super_admin,
    'roleKeys', to_jsonb(public.get_user_role_keys(p_user_id)),
    'permissionKeys', to_jsonb(public.get_user_permission_keys(p_user_id)),
    'accessScopes', public.get_user_access_scopes(p_user_id),
    'accessibleCompanyIds', to_jsonb(public.get_accessible_company_ids(p_user_id)),
    'accessibleEventIds', to_jsonb(public.get_accessible_event_ids(p_user_id))
)
from user_row;
$$;

create or replace function public.current_user_rbac_context()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
    select public.get_user_rbac_context(public.current_user_id())
$$;
