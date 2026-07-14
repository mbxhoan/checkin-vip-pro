-- Development seed for the Giltech Solutions Check-in SaaS foundation.
-- This file assumes the foundation migration already created the core tables and RBAC registry.

do $$
declare
    v_starter_plan_id bigint;
    v_growth_plan_id bigint;
    v_platform_auth_user_id uuid := '11111111-1111-4111-8111-111111111101';
    v_demo_admin_auth_user_id uuid := '11111111-1111-4111-8111-111111111102';
    v_demo_manager_auth_user_id uuid := '11111111-1111-4111-8111-111111111103';
    v_demo_scanner_auth_user_id uuid := '11111111-1111-4111-8111-111111111104';
    v_demo_analyst_auth_user_id uuid := '11111111-1111-4111-8111-111111111105';
    v_giltech_company_id bigint := 101;
    v_demo_company_id bigint := 201;
    v_giltech_event_id bigint := 401;
    v_demo_event_id bigint := 402;
    v_giltech_landing_page_id bigint := 501;
    v_demo_report_id bigint := 601;
    v_giltech_system_user_id bigint := 1001;
    v_demo_admin_user_id bigint := 1002;
    v_demo_manager_user_id bigint := 1003;
    v_demo_scanner_user_id bigint := 1004;
    v_demo_analyst_user_id bigint := 1005;
    v_system_role_id bigint;
    v_company_admin_role_id bigint;
    v_event_manager_role_id bigint;
    v_report_analyst_role_id bigint;
    v_scanner_device_role_id bigint;
    v_main_hall_area_id bigint := 701;
    v_company_field_id bigint := 801;
    v_demo_client_one_id bigint := 901;
    v_demo_client_two_id bigint := 902;
    v_demo_scanner_device_id bigint := 951;
    v_demo_checkin_id bigint := 1001;
begin
    insert into public.subscription_plans (
        id,
        code,
        name,
        description,
        billing_interval,
        price_amount,
        currency_code,
        feature_flags,
        limits,
        is_active,
        metadata
    )
    values (
        1,
        'starter',
        'Starter',
        'Core check-in package for a single company and limited event volume',
        'monthly',
        0,
        'USD',
        '{"multi_company": false, "rbac": true, "reports": true}'::jsonb,
        '{"companies": 1, "events": 3, "users": 10}'::jsonb,
        true,
        '{"seed": true}'::jsonb
    )
    on conflict (code) do update set
        name = excluded.name,
        description = excluded.description,
        billing_interval = excluded.billing_interval,
        price_amount = excluded.price_amount,
        currency_code = excluded.currency_code,
        feature_flags = excluded.feature_flags,
        limits = excluded.limits,
        is_active = excluded.is_active,
        metadata = excluded.metadata
    returning id into v_starter_plan_id;

    insert into public.subscription_plans (
        id,
        code,
        name,
        description,
        billing_interval,
        price_amount,
        currency_code,
        feature_flags,
        limits,
        is_active,
        metadata
    )
    values (
        2,
        'growth',
        'Growth',
        'Multi-company package with higher event and user limits',
        'monthly',
        199,
        'USD',
        '{"multi_company": true, "rbac": true, "reports": true, "automation": true}'::jsonb,
        '{"companies": 10, "events": 50, "users": 200}'::jsonb,
        true,
        '{"seed": true}'::jsonb
    )
    on conflict (code) do update set
        name = excluded.name,
        description = excluded.description,
        billing_interval = excluded.billing_interval,
        price_amount = excluded.price_amount,
        currency_code = excluded.currency_code,
        feature_flags = excluded.feature_flags,
        limits = excluded.limits,
        is_active = excluded.is_active,
        metadata = excluded.metadata
    returning id into v_growth_plan_id;

    insert into public.companies (
        id,
        public_id,
        slug,
        name,
        legal_name,
        status,
        timezone,
        country_code,
        billing_email,
        contact_email,
        contact_phone,
        website_url,
        settings,
        branding,
        metadata
    )
    values (
        v_giltech_company_id,
        '11111111-1111-4111-8111-111111111111',
        'giltech-solutions',
        'Giltech Solutions',
        'Giltech Solutions',
        'active',
        'Asia/Ho_Chi_Minh',
        'VN',
        'billing@giltechsolutions.local',
        'ops@giltechsolutions.local',
        '+84-28-0000-0001',
        'https://giltechsolutions.local',
        '{"multi_company_enabled": true, "default_locale": "vi"}'::jsonb,
        '{"primary_color": "#0F172A", "accent_color": "#14B8A6", "logo_text": "Giltech Solutions Check-in"}'::jsonb,
        '{"seed": true, "owner": true}'::jsonb
    ),
    (
        v_demo_company_id,
        '22222222-2222-4222-8222-222222222222',
        'northwind-expo',
        'Northwind Expo',
        'Northwind Expo Limited',
        'active',
        'Asia/Ho_Chi_Minh',
        'VN',
        'billing@northwind-expo.local',
        'admin@northwind-expo.local',
        '+84-28-0000-0002',
        'https://northwind-expo.local',
        '{"multi_company_enabled": true, "default_locale": "vi"}'::jsonb,
        '{"primary_color": "#1D4ED8", "accent_color": "#F97316", "logo_text": "Northwind Expo"}'::jsonb,
        '{"seed": true, "demo": true}'::jsonb
    )
    on conflict (public_id) do update set
        slug = excluded.slug,
        name = excluded.name,
        legal_name = excluded.legal_name,
        status = excluded.status,
        timezone = excluded.timezone,
        country_code = excluded.country_code,
        billing_email = excluded.billing_email,
        contact_email = excluded.contact_email,
        contact_phone = excluded.contact_phone,
        website_url = excluded.website_url,
        settings = excluded.settings,
        branding = excluded.branding,
        metadata = excluded.metadata;

    insert into public.company_domains (
        id,
        company_id,
        domain,
        is_primary,
        is_active,
        metadata
    )
    values
    (
        1101,
        v_giltech_company_id,
        'giltech-solutions.local',
        true,
        true,
        '{"seed": true}'::jsonb
    ),
    (
        1102,
        v_demo_company_id,
        'northwind-expo.local',
        true,
        true,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        company_id = excluded.company_id,
        domain = excluded.domain,
        is_primary = excluded.is_primary,
        is_active = excluded.is_active,
        metadata = excluded.metadata;

    insert into public.company_subscriptions (
        id,
        company_id,
        plan_id,
        status,
        starts_at,
        ends_at,
        trial_ends_at,
        billing_metadata,
        metadata
    )
    values
    (
        1201,
        v_giltech_company_id,
        v_starter_plan_id,
        'active',
        timestamptz '2026-04-01 00:00:00+07',
        null,
        null,
        '{"provider": "manual"}'::jsonb,
        '{"seed": true}'::jsonb
    ),
    (
        1202,
        v_demo_company_id,
        v_growth_plan_id,
        'trialing',
        timestamptz '2026-04-01 00:00:00+07',
        null,
        timestamptz '2026-05-01 00:00:00+07',
        '{"provider": "manual"}'::jsonb,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        company_id = excluded.company_id,
        plan_id = excluded.plan_id,
        status = excluded.status,
        starts_at = excluded.starts_at,
        ends_at = excluded.ends_at,
        trial_ends_at = excluded.trial_ends_at,
        billing_metadata = excluded.billing_metadata,
        metadata = excluded.metadata;

    select id into v_system_role_id from public.roles where key = 'system_admin';
    select id into v_company_admin_role_id from public.roles where key = 'company_admin';
    select id into v_event_manager_role_id from public.roles where key = 'event_manager';
    select id into v_report_analyst_role_id from public.roles where key = 'report_analyst';
    select id into v_scanner_device_role_id from public.roles where key = 'scanner_device';

    set session_replication_role = replica;

    insert into public.users (
        id,
        auth_user_id,
        email,
        full_name,
        display_name,
        status,
        login_app,
        is_super_admin,
        default_company_id,
        locale,
        preferences,
        metadata,
        legacy_role_key
    )
    values
    (
        v_giltech_system_user_id,
        v_platform_auth_user_id,
        'platform@giltechsolutions.local',
        'Platform Admin',
        'Platform Admin',
        'active',
        'both',
        true,
        v_giltech_company_id,
        'vi',
        '{"theme": "dark", "workspace": "giltech"}'::jsonb,
        '{"seed": true}'::jsonb,
        'system_admin'
    ),
    (
        v_demo_admin_user_id,
        v_demo_admin_auth_user_id,
        'admin@northwind-expo.local',
        'Northwind Admin',
        'Northwind Admin',
        'active',
        'web',
        false,
        v_demo_company_id,
        'vi',
        '{"workspace": "northwind"}'::jsonb,
        '{"seed": true}'::jsonb,
        'company_admin'
    ),
    (
        v_demo_manager_user_id,
        v_demo_manager_auth_user_id,
        'manager@northwind-expo.local',
        'Event Manager',
        'Event Manager',
        'active',
        'web',
        false,
        v_demo_company_id,
        'vi',
        '{"workspace": "northwind"}'::jsonb,
        '{"seed": true}'::jsonb,
        'event_manager'
    ),
    (
        v_demo_scanner_user_id,
        v_demo_scanner_auth_user_id,
        'scanner@northwind-expo.local',
        'Scanner Device',
        'Scanner Device',
        'active',
        'scanner',
        false,
        v_demo_company_id,
        'vi',
        '{"workspace": "northwind"}'::jsonb,
        '{"seed": true}'::jsonb,
        'scanner_device'
    ),
    (
        v_demo_analyst_user_id,
        v_demo_analyst_auth_user_id,
        'analyst@northwind-expo.local',
        'Report Analyst',
        'Report Analyst',
        'active',
        'web',
        false,
        v_demo_company_id,
        'vi',
        '{"workspace": "northwind"}'::jsonb,
        '{"seed": true}'::jsonb,
        'report_analyst'
    )
    on conflict (id) do update set
        auth_user_id = coalesce(excluded.auth_user_id, public.users.auth_user_id),
        email = excluded.email,
        full_name = excluded.full_name,
        display_name = excluded.display_name,
        status = excluded.status,
        login_app = excluded.login_app,
        is_super_admin = excluded.is_super_admin,
        default_company_id = excluded.default_company_id,
        locale = excluded.locale,
        preferences = excluded.preferences,
        metadata = excluded.metadata,
        legacy_role_key = excluded.legacy_role_key;

    insert into auth.users (
        id,
        aud,
        role,
        email,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        is_sso_user,
        is_anonymous
    )
    values
    (
        v_platform_auth_user_id,
        'authenticated',
        'authenticated',
        'platform@giltechsolutions.local',
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "Platform Admin", "display_name": "Platform Admin"}'::jsonb,
        true,
        now(),
        now(),
        false,
        false
    ),
    (
        v_demo_admin_auth_user_id,
        'authenticated',
        'authenticated',
        'admin@northwind-expo.local',
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "Northwind Admin", "display_name": "Northwind Admin"}'::jsonb,
        false,
        now(),
        now(),
        false,
        false
    ),
    (
        v_demo_manager_auth_user_id,
        'authenticated',
        'authenticated',
        'manager@northwind-expo.local',
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "Event Manager", "display_name": "Event Manager"}'::jsonb,
        false,
        now(),
        now(),
        false,
        false
    ),
    (
        v_demo_scanner_auth_user_id,
        'authenticated',
        'authenticated',
        'scanner@northwind-expo.local',
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "Scanner Device", "display_name": "Scanner Device"}'::jsonb,
        false,
        now(),
        now(),
        false,
        false
    ),
    (
        v_demo_analyst_auth_user_id,
        'authenticated',
        'authenticated',
        'analyst@northwind-expo.local',
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "Report Analyst", "display_name": "Report Analyst"}'::jsonb,
        false,
        now(),
        now(),
        false,
        false
    )
    on conflict (id) do update set
        aud = excluded.aud,
        role = excluded.role,
        email = excluded.email,
        email_confirmed_at = excluded.email_confirmed_at,
        raw_app_meta_data = excluded.raw_app_meta_data,
        raw_user_meta_data = excluded.raw_user_meta_data,
        is_super_admin = excluded.is_super_admin,
        updated_at = excluded.updated_at,
        is_sso_user = excluded.is_sso_user,
        is_anonymous = excluded.is_anonymous;

    set session_replication_role = origin;

    insert into public.events (
        id,
        public_id,
        company_id,
        slug,
        code,
        name,
        description,
        timezone,
        location_name,
        location_address,
        starts_at,
        ends_at,
        registration_opens_at,
        registration_closes_at,
        status,
        visibility,
        feature_flags,
        metadata
    )
    values
    (
        v_giltech_event_id,
        '33333333-3333-4333-8333-333333333333',
        v_giltech_company_id,
        'giltech-launch-2026',
        'GL-2026',
        'Giltech Launch 2026',
        'Internal launch event for Giltech Solutions',
        'Asia/Ho_Chi_Minh',
        'Giltech HQ',
        'District 1, Ho Chi Minh City',
        timestamptz '2026-04-18 09:00:00+07',
        timestamptz '2026-04-18 17:00:00+07',
        timestamptz '2026-04-01 00:00:00+07',
        timestamptz '2026-04-17 23:59:59+07',
        'active',
        'private',
        '{"checkin": true, "landing_page": true, "reports": true}'::jsonb,
        '{"seed": true}'::jsonb
    ),
    (
        v_demo_event_id,
        '44444444-4444-4444-8444-444444444444',
        v_demo_company_id,
        'northwind-summit-2026',
        'NW-2026',
        'Northwind Summit 2026',
        'Demo event for multi-company and RBAC validation',
        'Asia/Ho_Chi_Minh',
        'Northwind Convention Center',
        'Thu Duc City, Ho Chi Minh City',
        timestamptz '2026-04-20 09:00:00+07',
        timestamptz '2026-04-20 18:00:00+07',
        timestamptz '2026-04-01 00:00:00+07',
        timestamptz '2026-04-19 23:59:59+07',
        'published',
        'public',
        '{"checkin": true, "landing_page": true, "reports": true}'::jsonb,
        '{"seed": true, "demo": true}'::jsonb
    )
    on conflict (public_id) do update set
        company_id = excluded.company_id,
        slug = excluded.slug,
        code = excluded.code,
        name = excluded.name,
        description = excluded.description,
        timezone = excluded.timezone,
        location_name = excluded.location_name,
        location_address = excluded.location_address,
        starts_at = excluded.starts_at,
        ends_at = excluded.ends_at,
        registration_opens_at = excluded.registration_opens_at,
        registration_closes_at = excluded.registration_closes_at,
        status = excluded.status,
        visibility = excluded.visibility,
        feature_flags = excluded.feature_flags,
        metadata = excluded.metadata;

    insert into public.user_access_scopes (
        id,
        user_id,
        role_id,
        scope_type,
        company_id,
        event_id,
        membership_status,
        granted_by_user_id,
        starts_at,
        ends_at,
        metadata
    )
    values
    (
        2001,
        v_giltech_system_user_id,
        v_system_role_id,
        'system',
        null,
        null,
        'active',
        v_giltech_system_user_id,
        timestamptz '2026-04-01 00:00:00+07',
        null,
        '{"seed": true}'::jsonb
    ),
    (
        2002,
        v_demo_admin_user_id,
        v_company_admin_role_id,
        'company',
        v_demo_company_id,
        null,
        'active',
        v_giltech_system_user_id,
        timestamptz '2026-04-01 00:00:00+07',
        null,
        '{"seed": true}'::jsonb
    ),
    (
        2003,
        v_demo_manager_user_id,
        v_event_manager_role_id,
        'event',
        v_demo_company_id,
        v_demo_event_id,
        'active',
        v_demo_admin_user_id,
        timestamptz '2026-04-01 00:00:00+07',
        null,
        '{"seed": true}'::jsonb
    ),
    (
        2004,
        v_demo_scanner_user_id,
        v_scanner_device_role_id,
        'event',
        v_demo_company_id,
        v_demo_event_id,
        'active',
        v_demo_admin_user_id,
        timestamptz '2026-04-01 00:00:00+07',
        null,
        '{"seed": true}'::jsonb
    ),
    (
        2005,
        v_demo_analyst_user_id,
        v_report_analyst_role_id,
        'company',
        v_demo_company_id,
        null,
        'active',
        v_demo_admin_user_id,
        timestamptz '2026-04-01 00:00:00+07',
        null,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        user_id = excluded.user_id,
        role_id = excluded.role_id,
        scope_type = excluded.scope_type,
        company_id = excluded.company_id,
        event_id = excluded.event_id,
        membership_status = excluded.membership_status,
        granted_by_user_id = excluded.granted_by_user_id,
        starts_at = excluded.starts_at,
        ends_at = excluded.ends_at,
        metadata = excluded.metadata;

    insert into public.landing_pages (
        id,
        public_id,
        event_id,
        slug,
        name,
        title,
        status,
        theme_key,
        layout_version,
        hero_content,
        blocks,
        form_settings,
        success_settings,
        seo_meta,
        published_at,
        metadata
    )
    values (
        v_giltech_landing_page_id,
        '55555555-5555-4555-8555-555555555555',
        v_demo_event_id,
        'northwind-summit-2026-register',
        'Northwind Summit Registration',
        'Northwind Summit 2026 Registration',
        'published',
        'giltech-default',
        1,
        '{"headline": "Northwind Summit 2026", "subheadline": "Register now to secure your spot."}'::jsonb,
        '[{"type": "text", "value": "Register your company and attendee details."}, {"type": "cta", "value": "Submit registration"}]'::jsonb,
        '{"success_title": "Registration received", "show_qr": true}'::jsonb,
        '{"title": "Northwind Summit 2026", "description": "Multi-company event registration"}'::jsonb,
        '{"title": "Northwind Summit 2026 Registration"}'::jsonb,
        timestamptz '2026-04-01 00:00:00+07',
        '{"seed": true}'::jsonb
    )
    on conflict (public_id) do update set
        event_id = excluded.event_id,
        slug = excluded.slug,
        name = excluded.name,
        title = excluded.title,
        status = excluded.status,
        theme_key = excluded.theme_key,
        layout_version = excluded.layout_version,
        hero_content = excluded.hero_content,
        blocks = excluded.blocks,
        form_settings = excluded.form_settings,
        success_settings = excluded.success_settings,
        seo_meta = excluded.seo_meta,
        published_at = excluded.published_at,
        metadata = excluded.metadata;

    insert into public.reports (
        id,
        scope_type,
        company_id,
        event_id,
        name,
        key,
        kind,
        description,
        definition,
        default_filters,
        display_settings,
        cache_ttl_seconds,
        is_system,
        is_active,
        metadata
    )
    values (
        v_demo_report_id,
        'event',
        v_demo_company_id,
        v_demo_event_id,
        'Attendance summary',
        'attendance_summary',
        'dashboard',
        'Seed report for check-in and audience attendance',
        '{"metrics": [{"key": "checked_in", "label": "Checked in"}, {"key": "pending", "label": "Pending"}]}'::jsonb,
        '{"status": ["active"]}'::jsonb,
        '{"layout": "cards"}'::jsonb,
        900,
        true,
        true,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        scope_type = excluded.scope_type,
        company_id = excluded.company_id,
        event_id = excluded.event_id,
        name = excluded.name,
        key = excluded.key,
        kind = excluded.kind,
        description = excluded.description,
        definition = excluded.definition,
        default_filters = excluded.default_filters,
        display_settings = excluded.display_settings,
        cache_ttl_seconds = excluded.cache_ttl_seconds,
        is_system = excluded.is_system,
        is_active = excluded.is_active,
        metadata = excluded.metadata;

    insert into public.event_settings (
        id,
        event_id,
        registration_settings,
        checkin_settings,
        report_settings,
        print_settings,
        communication_settings,
        public_settings,
        metadata
    )
    values (
        3001,
        v_demo_event_id,
        '{"allow_self_registration": true, "default_locale": "vi"}'::jsonb,
        '{"allow_recheckin": false, "require_scanner_device": true}'::jsonb,
        '{"timezone": "Asia/Ho_Chi_Minh"}'::jsonb,
        '{"default_printer_mode": "batch"}'::jsonb,
        '{"postmark_enabled": true}'::jsonb,
        '{"public_registration": true}'::jsonb,
        '{"seed": true}'::jsonb
    )
    on conflict (event_id) do update set
        registration_settings = excluded.registration_settings,
        checkin_settings = excluded.checkin_settings,
        report_settings = excluded.report_settings,
        print_settings = excluded.print_settings,
        communication_settings = excluded.communication_settings,
        public_settings = excluded.public_settings,
        metadata = excluded.metadata;

    insert into public.event_areas (
        id,
        event_id,
        code,
        name,
        description,
        sort_order,
        is_active,
        settings,
        metadata
    )
    values (
        v_main_hall_area_id,
        v_demo_event_id,
        'main-hall',
        'Main Hall',
        'Primary check-in zone',
        1,
        true,
        '{"capacity": 500}'::jsonb,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        event_id = excluded.event_id,
        code = excluded.code,
        name = excluded.name,
        description = excluded.description,
        sort_order = excluded.sort_order,
        is_active = excluded.is_active,
        settings = excluded.settings,
        metadata = excluded.metadata;

    insert into public.custom_field_templates (
        id,
        event_id,
        key,
        label,
        help_text,
        field_type,
        target_surface,
        placeholder,
        default_value,
        options,
        validation_rules,
        display_rules,
        sort_order,
        is_required,
        is_active,
        is_system,
        metadata
    )
    values (
        v_company_field_id,
        v_demo_event_id,
        'company_name',
        'Company name',
        'Use this field to capture the attendee company',
        'text',
        'registration',
        'Enter company name',
        null,
        '[]'::jsonb,
        '{"minLength": 2}'::jsonb,
        '{"showLabel": true}'::jsonb,
        1,
        false,
        true,
        false,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        event_id = excluded.event_id,
        key = excluded.key,
        label = excluded.label,
        help_text = excluded.help_text,
        field_type = excluded.field_type,
        target_surface = excluded.target_surface,
        placeholder = excluded.placeholder,
        default_value = excluded.default_value,
        options = excluded.options,
        validation_rules = excluded.validation_rules,
        display_rules = excluded.display_rules,
        sort_order = excluded.sort_order,
        is_required = excluded.is_required,
        is_active = excluded.is_active,
        is_system = excluded.is_system,
        metadata = excluded.metadata;

    insert into public.clients (
        id,
        public_id,
        event_id,
        event_area_id,
        source,
        status,
        registration_code,
        qr_code,
        first_name,
        last_name,
        full_name,
        email,
        phone,
        company_name,
        title,
        attendee_type,
        ticket_type,
        checked_in_at,
        registration_payload,
        internal_notes,
        metadata
    )
    values
    (
        v_demo_client_one_id,
        '66666666-6666-4666-8666-666666666666',
        v_demo_event_id,
        v_main_hall_area_id,
        'landing_page',
        'registered',
        'NW-0001',
        'NW-QR-0001',
        'An',
        'Nguyen',
        'An Nguyen',
        'an.nguyen@northwind-expo.local',
        '+84-900-000-001',
        'Northwind Trading',
        'Sales Manager',
        'visitor',
        'standard',
        timestamptz '2026-04-20 09:35:00+07',
        '{"company_name": "Northwind Trading", "ticket_type": "standard"}'::jsonb,
        'Seed attendee for check-in validation',
        '{"seed": true}'::jsonb
    ),
    (
        v_demo_client_two_id,
        '77777777-7777-4777-8777-777777777777',
        v_demo_event_id,
        v_main_hall_area_id,
        'manual',
        'pending',
        'NW-0002',
        'NW-QR-0002',
        'Binh',
        'Tran',
        'Binh Tran',
        'binh.tran@northwind-expo.local',
        '+84-900-000-002',
        'Northwind Logistics',
        'Operations Lead',
        'visitor',
        'vip',
        null,
        '{"company_name": "Northwind Logistics", "ticket_type": "vip"}'::jsonb,
        null,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        public_id = excluded.public_id,
        event_id = excluded.event_id,
        event_area_id = excluded.event_area_id,
        source = excluded.source,
        status = excluded.status,
        registration_code = excluded.registration_code,
        qr_code = excluded.qr_code,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone,
        company_name = excluded.company_name,
        title = excluded.title,
        attendee_type = excluded.attendee_type,
        ticket_type = excluded.ticket_type,
        checked_in_at = excluded.checked_in_at,
        registration_payload = excluded.registration_payload,
        internal_notes = excluded.internal_notes,
        metadata = excluded.metadata;

    insert into public.scanner_devices (
        id,
        event_id,
        user_id,
        device_name,
        device_code,
        status,
        last_seen_at,
        last_sync_at,
        assigned_at,
        metadata
    )
    values (
        v_demo_scanner_device_id,
        v_demo_event_id,
        v_demo_scanner_user_id,
        'Front Desk Scanner',
        '88888888-8888-4888-8888-888888888888',
        'active',
        timestamptz '2026-04-20 09:30:00+07',
        timestamptz '2026-04-20 09:32:00+07',
        timestamptz '2026-04-01 00:00:00+07',
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        event_id = excluded.event_id,
        user_id = excluded.user_id,
        device_name = excluded.device_name,
        device_code = excluded.device_code,
        status = excluded.status,
        last_seen_at = excluded.last_seen_at,
        last_sync_at = excluded.last_sync_at,
        assigned_at = excluded.assigned_at,
        metadata = excluded.metadata;

    insert into public.checkins (
        id,
        event_id,
        client_id,
        scanner_device_id,
        checked_by_user_id,
        event_area_id,
        status,
        method,
        happened_at,
        note,
        payload,
        metadata
    )
    values (
        v_demo_checkin_id,
        v_demo_event_id,
        v_demo_client_one_id,
        v_demo_scanner_device_id,
        v_demo_scanner_user_id,
        v_main_hall_area_id,
        'checked_in',
        'qr',
        timestamptz '2026-04-20 09:36:00+07',
        'Seed check-in record for runtime validation',
        '{"source": "seed"}'::jsonb,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        event_id = excluded.event_id,
        client_id = excluded.client_id,
        scanner_device_id = excluded.scanner_device_id,
        checked_by_user_id = excluded.checked_by_user_id,
        event_area_id = excluded.event_area_id,
        status = excluded.status,
        method = excluded.method,
        happened_at = excluded.happened_at,
        note = excluded.note,
        payload = excluded.payload,
        metadata = excluded.metadata;

    insert into public.legal_documents (
        id,
        document_key,
        locale,
        title,
        owner_name,
        content_html,
        content_text,
        version,
        published_at,
        is_active,
        metadata
    )
    values
    (
        4001,
        'terms-of-service',
        'vi',
        'Điều khoản sử dụng',
        'Giltech Solutions',
        '<h1>Điều khoản sử dụng</h1><p>Seed legal document for Giltech Solutions Check-in.</p>',
        'Seed legal document for Giltech Solutions Check-in.',
        '2026.04',
        timestamptz '2026-04-01 00:00:00+07',
        true,
        '{"seed": true}'::jsonb
    ),
    (
        4002,
        'privacy-policy',
        'vi',
        'Chính sách bảo mật',
        'Giltech Solutions',
        '<h1>Chính sách bảo mật</h1><p>Seed legal document for Giltech Solutions Check-in.</p>',
        'Seed legal document for Giltech Solutions Check-in.',
        '2026.04',
        timestamptz '2026-04-01 00:00:00+07',
        true,
        '{"seed": true}'::jsonb
    ),
    (
        4003,
        'payment-refund-policy',
        'vi',
        'Chính sách thanh toán và hoàn tiền',
        'Giltech Solutions',
        '<h1>Chính sách thanh toán và hoàn tiền</h1><p>Seed legal document for Giltech Solutions Check-in.</p>',
        'Seed legal document for Giltech Solutions Check-in.',
        '2026.04',
        timestamptz '2026-04-01 00:00:00+07',
        true,
        '{"seed": true}'::jsonb
    )
    on conflict (id) do update set
        document_key = excluded.document_key,
        locale = excluded.locale,
        title = excluded.title,
        owner_name = excluded.owner_name,
        content_html = excluded.content_html,
        content_text = excluded.content_text,
        version = excluded.version,
        published_at = excluded.published_at,
        is_active = excluded.is_active,
        metadata = excluded.metadata;
end;
$$;
