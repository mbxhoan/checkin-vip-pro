alter table public.email_senders enable row level security;
alter table public.email_templates enable row level security;
alter table public.email_template_unlock_requests enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_details enable row level security;
alter table public.emails enable row level security;
alter table public.labels enable row level security;
alter table public.label_details enable row level security;
alter table public.cards enable row level security;
alter table public.card_details enable row level security;
alter table public.printers enable row level security;
alter table public.print_jobs enable row level security;
alter table public.print_job_items enable row level security;
alter table public.audios enable row level security;
alter table public.lucky_draws enable row level security;
alter table public.lucky_draw_rewards enable row level security;
alter table public.lucky_draw_clients enable row level security;
alter table public.lucky_draw_winners enable row level security;
alter table public.n8n_chat_sessions enable row level security;
alter table public.n8n_chat_messages enable row level security;
alter table public.background_jobs enable row level security;
alter table public.integration_logs enable row level security;
alter table public.histories enable row level security;
alter table public.system_logs enable row level security;

drop policy if exists email_senders_select on public.email_senders;
create policy email_senders_select
on public.email_senders
for select
using (
    public.current_user_has_permission('email_sender.view', company_id)
);

drop policy if exists email_senders_write on public.email_senders;
create policy email_senders_write
on public.email_senders
for all
using (
    public.current_user_has_permission('email_sender.manage', company_id)
)
with check (
    public.current_user_has_permission('email_sender.manage', company_id)
);

drop policy if exists email_templates_select on public.email_templates;
create policy email_templates_select
on public.email_templates
for select
using (
    public.current_user_has_permission('email_template.view', company_id, event_id)
);

drop policy if exists email_templates_write on public.email_templates;
create policy email_templates_write
on public.email_templates
for all
using (
    public.current_user_has_permission('email_template.update', company_id, event_id)
    or public.current_user_has_permission('email_template.sync', company_id, event_id)
    or public.current_user_has_permission('email_template.unlock.manage', company_id, event_id)
)
with check (
    public.current_user_has_permission('email_template.update', company_id, event_id)
    or public.current_user_has_permission('email_template.sync', company_id, event_id)
    or public.current_user_has_permission('email_template.unlock.manage', company_id, event_id)
);

drop policy if exists email_template_unlock_requests_select on public.email_template_unlock_requests;
create policy email_template_unlock_requests_select
on public.email_template_unlock_requests
for select
using (
    public.current_user_has_permission('email_template.unlock.manage', company_id)
    or public.current_user_has_permission('email_template.unlock.request', company_id)
);

drop policy if exists email_template_unlock_requests_write on public.email_template_unlock_requests;
create policy email_template_unlock_requests_write
on public.email_template_unlock_requests
for all
using (
    public.current_user_has_permission('email_template.unlock.request', company_id)
    or public.current_user_has_permission('email_template.unlock.manage', company_id)
)
with check (
    public.current_user_has_permission('email_template.unlock.request', company_id)
    or public.current_user_has_permission('email_template.unlock.manage', company_id)
);

drop policy if exists campaigns_select on public.campaigns;
create policy campaigns_select
on public.campaigns
for select
using (
    public.current_user_has_permission('campaign.view', null, event_id)
);

drop policy if exists campaigns_write on public.campaigns;
create policy campaigns_write
on public.campaigns
for all
using (
    public.current_user_has_permission('campaign.create', null, event_id)
    or public.current_user_has_permission('campaign.update', null, event_id)
    or public.current_user_has_permission('campaign.send', null, event_id)
    or public.current_user_has_permission('campaign.cancel', null, event_id)
)
with check (
    public.current_user_has_permission('campaign.create', null, event_id)
    or public.current_user_has_permission('campaign.update', null, event_id)
    or public.current_user_has_permission('campaign.send', null, event_id)
    or public.current_user_has_permission('campaign.cancel', null, event_id)
);

drop policy if exists campaign_details_select on public.campaign_details;
create policy campaign_details_select
on public.campaign_details
for select
using (
    exists (
        select 1
        from public.campaigns c
        where c.id = campaign_id
          and public.current_user_has_permission('campaign.view', null, c.event_id)
    )
);

drop policy if exists campaign_details_write on public.campaign_details;
create policy campaign_details_write
on public.campaign_details
for all
using (
    exists (
        select 1
        from public.campaigns c
        where c.id = campaign_id
          and (
              public.current_user_has_permission('campaign.send', null, c.event_id)
              or public.current_user_has_permission('campaign.update', null, c.event_id)
          )
    )
)
with check (
    exists (
        select 1
        from public.campaigns c
        where c.id = campaign_id
          and (
              public.current_user_has_permission('campaign.send', null, c.event_id)
              or public.current_user_has_permission('campaign.update', null, c.event_id)
          )
    )
);

drop policy if exists emails_select on public.emails;
create policy emails_select
on public.emails
for select
using (
    exists (
        select 1
        from public.campaigns c
        where c.id = campaign_id
          and public.current_user_has_permission('email.view', null, c.event_id)
    )
);

drop policy if exists emails_write on public.emails;
create policy emails_write
on public.emails
for all
using (
    exists (
        select 1
        from public.campaigns c
        where c.id = campaign_id
          and (
              public.current_user_has_permission('email.cancel', null, c.event_id)
              or public.current_user_has_permission('email.status.change', null, c.event_id)
          )
    )
)
with check (
    exists (
        select 1
        from public.campaigns c
        where c.id = campaign_id
          and (
              public.current_user_has_permission('email.cancel', null, c.event_id)
              or public.current_user_has_permission('email.status.change', null, c.event_id)
          )
    )
);

drop policy if exists labels_select on public.labels;
create policy labels_select
on public.labels
for select
using (
    public.current_user_has_permission('label.view', null, event_id)
);

drop policy if exists labels_write on public.labels;
create policy labels_write
on public.labels
for all
using (
    public.current_user_has_permission('label.create', null, event_id)
    or public.current_user_has_permission('label.update', null, event_id)
    or public.current_user_has_permission('label.clone', null, event_id)
)
with check (
    public.current_user_has_permission('label.create', null, event_id)
    or public.current_user_has_permission('label.update', null, event_id)
    or public.current_user_has_permission('label.clone', null, event_id)
);

drop policy if exists label_details_select on public.label_details;
create policy label_details_select
on public.label_details
for select
using (
    exists (
        select 1
        from public.labels l
        where l.id = label_id
          and public.current_user_has_permission('label.view', null, l.event_id)
    )
);

drop policy if exists label_details_write on public.label_details;
create policy label_details_write
on public.label_details
for all
using (
    exists (
        select 1
        from public.labels l
        where l.id = label_id
          and (
              public.current_user_has_permission('label.update', null, l.event_id)
              or public.current_user_has_permission('label.clone', null, l.event_id)
          )
    )
)
with check (
    exists (
        select 1
        from public.labels l
        where l.id = label_id
          and (
              public.current_user_has_permission('label.update', null, l.event_id)
              or public.current_user_has_permission('label.clone', null, l.event_id)
          )
    )
);

drop policy if exists cards_select on public.cards;
create policy cards_select
on public.cards
for select
using (
    public.current_user_has_permission('card.view', null, event_id)
);

drop policy if exists cards_write on public.cards;
create policy cards_write
on public.cards
for all
using (
    public.current_user_has_permission('card.create', null, event_id)
    or public.current_user_has_permission('card.update', null, event_id)
    or public.current_user_has_permission('card.clone', null, event_id)
)
with check (
    public.current_user_has_permission('card.create', null, event_id)
    or public.current_user_has_permission('card.update', null, event_id)
    or public.current_user_has_permission('card.clone', null, event_id)
);

drop policy if exists card_details_select on public.card_details;
create policy card_details_select
on public.card_details
for select
using (
    exists (
        select 1
        from public.cards c
        where c.id = card_id
          and public.current_user_has_permission('card.view', null, c.event_id)
    )
);

drop policy if exists card_details_write on public.card_details;
create policy card_details_write
on public.card_details
for all
using (
    exists (
        select 1
        from public.cards c
        where c.id = card_id
          and (
              public.current_user_has_permission('card.update', null, c.event_id)
              or public.current_user_has_permission('card.clone', null, c.event_id)
          )
    )
)
with check (
    exists (
        select 1
        from public.cards c
        where c.id = card_id
          and (
              public.current_user_has_permission('card.update', null, c.event_id)
              or public.current_user_has_permission('card.clone', null, c.event_id)
          )
    )
);

drop policy if exists printers_select on public.printers;
create policy printers_select
on public.printers
for select
using (
    public.current_user_has_permission('label.print', company_id, event_id)
    or public.current_user_has_permission('card.render', company_id, event_id)
);

drop policy if exists printers_write on public.printers;
create policy printers_write
on public.printers
for all
using (
    public.current_user_has_permission('company.manage_settings', company_id)
);

drop policy if exists print_jobs_select on public.print_jobs;
create policy print_jobs_select
on public.print_jobs
for select
using (
    public.current_user_has_permission('label.view', company_id, event_id)
    or public.current_user_has_permission('card.view', company_id, event_id)
    or public.current_user_has_permission('label.print', company_id, event_id)
    or public.current_user_has_permission('card.render', company_id, event_id)
);

drop policy if exists print_jobs_write on public.print_jobs;
create policy print_jobs_write
on public.print_jobs
for all
using (
    public.current_user_has_permission('label.print', company_id, event_id)
    or public.current_user_has_permission('card.render', company_id, event_id)
)
with check (
    public.current_user_has_permission('label.print', company_id, event_id)
    or public.current_user_has_permission('card.render', company_id, event_id)
);

drop policy if exists print_job_items_select on public.print_job_items;
create policy print_job_items_select
on public.print_job_items
for select
using (
    exists (
        select 1
        from public.print_jobs pj
        where pj.id = print_job_id
          and (
              public.current_user_has_permission('label.print', pj.company_id, pj.event_id)
              or public.current_user_has_permission('card.render', pj.company_id, pj.event_id)
          )
    )
);

drop policy if exists print_job_items_write on public.print_job_items;
create policy print_job_items_write
on public.print_job_items
for all
using (
    exists (
        select 1
        from public.print_jobs pj
        where pj.id = print_job_id
          and (
              public.current_user_has_permission('label.print', pj.company_id, pj.event_id)
              or public.current_user_has_permission('card.render', pj.company_id, pj.event_id)
          )
    )
)
with check (
    exists (
        select 1
        from public.print_jobs pj
        where pj.id = print_job_id
          and (
              public.current_user_has_permission('label.print', pj.company_id, pj.event_id)
              or public.current_user_has_permission('card.render', pj.company_id, pj.event_id)
          )
    )
);

drop policy if exists audios_select on public.audios;
create policy audios_select
on public.audios
for select
using (
    public.current_user_has_permission('audio.assign', company_id, event_id)
    or public.current_user_has_permission('event.view', company_id, event_id)
);

drop policy if exists audios_write on public.audios;
create policy audios_write
on public.audios
for all
using (
    public.current_user_has_permission('audio.assign', company_id, event_id)
    or public.current_user_has_permission('event.update', company_id, event_id)
)
with check (
    public.current_user_has_permission('audio.assign', company_id, event_id)
    or public.current_user_has_permission('event.update', company_id, event_id)
);

drop policy if exists lucky_draws_select on public.lucky_draws;
create policy lucky_draws_select
on public.lucky_draws
for select
using (
    public.current_user_has_permission('lucky_draw.view', null, event_id)
);

drop policy if exists lucky_draws_write on public.lucky_draws;
create policy lucky_draws_write
on public.lucky_draws
for all
using (
    public.current_user_has_permission('lucky_draw.create', null, event_id)
    or public.current_user_has_permission('lucky_draw.update', null, event_id)
    or public.current_user_has_permission('lucky_draw.run', null, event_id)
    or public.current_user_has_permission('lucky_draw.reset', null, event_id)
    or public.current_user_has_permission('lucky_draw.manage_rewards', null, event_id)
)
with check (
    public.current_user_has_permission('lucky_draw.create', null, event_id)
    or public.current_user_has_permission('lucky_draw.update', null, event_id)
    or public.current_user_has_permission('lucky_draw.run', null, event_id)
    or public.current_user_has_permission('lucky_draw.reset', null, event_id)
    or public.current_user_has_permission('lucky_draw.manage_rewards', null, event_id)
);

drop policy if exists lucky_draw_rewards_select on public.lucky_draw_rewards;
create policy lucky_draw_rewards_select
on public.lucky_draw_rewards
for select
using (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.view', null, ld.event_id)
    )
);

drop policy if exists lucky_draw_rewards_write on public.lucky_draw_rewards;
create policy lucky_draw_rewards_write
on public.lucky_draw_rewards
for all
using (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.manage_rewards', null, ld.event_id)
    )
)
with check (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.manage_rewards', null, ld.event_id)
    )
);

drop policy if exists lucky_draw_clients_select on public.lucky_draw_clients;
create policy lucky_draw_clients_select
on public.lucky_draw_clients
for select
using (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.view', null, ld.event_id)
    )
);

drop policy if exists lucky_draw_clients_write on public.lucky_draw_clients;
create policy lucky_draw_clients_write
on public.lucky_draw_clients
for all
using (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.run', null, ld.event_id)
    )
)
with check (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.run', null, ld.event_id)
    )
);

drop policy if exists lucky_draw_winners_select on public.lucky_draw_winners;
create policy lucky_draw_winners_select
on public.lucky_draw_winners
for select
using (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.view', null, ld.event_id)
    )
);

drop policy if exists lucky_draw_winners_write on public.lucky_draw_winners;
create policy lucky_draw_winners_write
on public.lucky_draw_winners
for all
using (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.run', null, ld.event_id)
    )
)
with check (
    exists (
        select 1
        from public.lucky_draws ld
        where ld.id = lucky_draw_id
          and public.current_user_has_permission('lucky_draw.run', null, ld.event_id)
    )
);

drop policy if exists n8n_chat_sessions_select on public.n8n_chat_sessions;
create policy n8n_chat_sessions_select
on public.n8n_chat_sessions
for select
using (
    public.current_user_has_permission('chatbot.history.view', company_id, event_id)
    or public.current_user_has_permission('chatbot.use', company_id, event_id)
    or public.current_user_has_permission('chatbot.admin', company_id, event_id)
);

drop policy if exists n8n_chat_sessions_write on public.n8n_chat_sessions;
create policy n8n_chat_sessions_write
on public.n8n_chat_sessions
for all
using (
    public.current_user_has_permission('chatbot.use', company_id, event_id)
    or public.current_user_has_permission('chatbot.admin', company_id, event_id)
)
with check (
    public.current_user_has_permission('chatbot.use', company_id, event_id)
    or public.current_user_has_permission('chatbot.admin', company_id, event_id)
);

drop policy if exists n8n_chat_messages_select on public.n8n_chat_messages;
create policy n8n_chat_messages_select
on public.n8n_chat_messages
for select
using (
    exists (
        select 1
        from public.n8n_chat_sessions cs
        where cs.id = session_id
          and (
              public.current_user_has_permission('chatbot.history.view', cs.company_id, cs.event_id)
              or public.current_user_has_permission('chatbot.use', cs.company_id, cs.event_id)
              or public.current_user_has_permission('chatbot.admin', cs.company_id, cs.event_id)
          )
    )
);

drop policy if exists n8n_chat_messages_write on public.n8n_chat_messages;
create policy n8n_chat_messages_write
on public.n8n_chat_messages
for all
using (
    exists (
        select 1
        from public.n8n_chat_sessions cs
        where cs.id = session_id
          and (
              public.current_user_has_permission('chatbot.use', cs.company_id, cs.event_id)
              or public.current_user_has_permission('chatbot.admin', cs.company_id, cs.event_id)
          )
    )
)
with check (
    exists (
        select 1
        from public.n8n_chat_sessions cs
        where cs.id = session_id
          and (
              public.current_user_has_permission('chatbot.use', cs.company_id, cs.event_id)
              or public.current_user_has_permission('chatbot.admin', cs.company_id, cs.event_id)
          )
    )
);

drop policy if exists background_jobs_select on public.background_jobs;
create policy background_jobs_select
on public.background_jobs
for select
using (
    public.current_user_has_permission('system_log.view', company_id, event_id)
    or public.current_user_has_permission('history.view', company_id, event_id)
);

drop policy if exists background_jobs_write on public.background_jobs;
create policy background_jobs_write
on public.background_jobs
for all
using (
    public.current_user_has_permission('system_log.view', company_id, event_id)
)
with check (
    public.current_user_has_permission('system_log.view', company_id, event_id)
);

drop policy if exists integration_logs_select on public.integration_logs;
create policy integration_logs_select
on public.integration_logs
for select
using (
    public.current_user_has_permission('system_log.view', company_id, event_id)
);

drop policy if exists integration_logs_write on public.integration_logs;
create policy integration_logs_write
on public.integration_logs
for all
using (
    public.current_user_has_permission('system_log.view', company_id, event_id)
)
with check (
    public.current_user_has_permission('system_log.view', company_id, event_id)
);

drop policy if exists histories_select on public.histories;
create policy histories_select
on public.histories
for select
using (
    public.current_user_has_permission('history.view', company_id, event_id)
);

drop policy if exists histories_write on public.histories;
create policy histories_write
on public.histories
for all
using (
    public.current_user_has_permission('history.view', company_id, event_id)
)
with check (
    public.current_user_has_permission('history.view', company_id, event_id)
);

drop policy if exists system_logs_select on public.system_logs;
create policy system_logs_select
on public.system_logs
for select
using (
    public.current_user_has_permission('system_log.view', company_id, event_id)
);

drop policy if exists system_logs_write on public.system_logs;
create policy system_logs_write
on public.system_logs
for all
using (
    public.current_user_has_permission('system_log.view', company_id, event_id)
)
with check (
    public.current_user_has_permission('system_log.view', company_id, event_id)
);
