-- ENUM de papéis
create type public.app_role as enum ('admin','strategist','copywriter','designer','editor','traffic_manager','client');

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- WORKSPACES
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  role public.app_role not null default 'admin',
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  avatar_url text,
  current_workspace_id uuid references public.workspaces(id) on delete set null,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workspace_members m where m.workspace_id = _workspace_id and m.user_id = auth.uid());
$$;

create or replace function public.workspace_role(_workspace_id uuid)
returns public.app_role language sql stable security definer set search_path = public as $$
  select m.role from public.workspace_members m where m.workspace_id = _workspace_id and m.user_id = auth.uid() limit 1;
$$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- DOMAIN TABLES
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  company text,
  segment text,
  contact_name text,
  contact_email text,
  contact_phone text,
  status text not null default 'ativo',
  brand_notes text,
  brand_colors text[] default '{}',
  brand_fonts text,
  notes text,
  logo_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  product text,
  objective text,
  platforms text[] default '{}',
  funnel text,
  starts_on date,
  ends_on date,
  status text not null default 'ativo',
  owners text[] default '{}',
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null, description text, price numeric,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null, promise text, price numeric, bonuses text, guarantee text, urgency text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null, platform text, external_id text, objective text, budget numeric,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.briefs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  status text not null default 'rascunho',
  awareness text, funnel text,
  data jsonb not null default '{}'::jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.icps (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  brief_id uuid references public.briefs(id) on delete cascade,
  name text not null, description text, pains text, desires text, objections text, demographics text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.voc_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  quote text not null, source text, category text, tags text[] default '{}',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.angles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null, category text not null default 'pain',
  description text, when_to_use text, examples text, tags text[] default '{}',
  is_favorite boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.hooks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  text text not null, category text not null default 'curiosidade',
  notes text, tags text[] default '{}',
  is_favorite boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.copy_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null, headline text, primary_text text, cta text,
  format text, funnel text, awareness text, tags text[] default '{}',
  is_favorite boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.matrix_rows (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  audience text, awareness text, funnel text,
  angle_id uuid references public.angles(id) on delete set null,
  hook_id uuid references public.hooks(id) on delete set null,
  offer text, format text, platform text, hypothesis text,
  status text not null default 'oportunidade',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.creatives (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  code text not null,
  seq integer not null,
  name text not null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  brief_id uuid references public.briefs(id) on delete set null,
  product text, offer text,
  platform text, format text, objective text, funnel text, awareness text,
  angle_id uuid references public.angles(id) on delete set null,
  hook_id uuid references public.hooks(id) on delete set null,
  copy_id uuid references public.copy_items(id) on delete set null,
  headline text, primary_text text, cta text,
  hypothesis_change text, hypothesis_result text, hypothesis_reason text,
  hypothesis_expectation text, hypothesis_actual text,
  owner text, priority text not null default 'media',
  status text not null default 'BACKLOG',
  tags text[] default '{}',
  references_notes text,
  thumbnail_url text,
  due_date date,
  parent_id uuid references public.creatives(id) on delete set null,
  iteration_variable text,
  score_clarity int default 0, score_hook int default 0, score_hierarchy int default 0,
  score_relevance int default 0, score_differentiation int default 0, score_proof int default 0,
  score_cta int default 0, score_platform_fit int default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (workspace_id, code)
);

create or replace function public.set_creative_code() returns trigger language plpgsql set search_path = public as $$
declare n integer;
begin
  if new.code is null or new.code = '' then
    select coalesce(max(seq),0)+1 into n from public.creatives where workspace_id = new.workspace_id;
    new.seq := n;
    new.code := 'C-' || lpad(n::text, 6, '0');
  end if;
  return new;
end $$;
create trigger creatives_code before insert on public.creatives for each row execute function public.set_creative_code();
alter table public.creatives alter column code drop not null;
alter table public.creatives alter column seq drop not null;

create table public.creative_concepts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  creative_id uuid not null references public.creatives(id) on delete cascade,
  problem text, big_idea text, main_message text, mechanism text, proof text, cta text, rationale text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.creative_directions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  creative_id uuid not null references public.creatives(id) on delete cascade,
  format text, composition text, hierarchy text, elements text, scenario text, characters text,
  style text, typography text, colors text, motion text, refs text, production_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.creative_versions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  creative_id uuid not null references public.creatives(id) on delete cascade,
  version integer not null default 1,
  changes text, author text, comment text, asset_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  creative_id uuid not null references public.creatives(id) on delete cascade,
  version_id uuid references public.creative_versions(id) on delete set null,
  status text not null default 'pendente',
  reviewer text, comment text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  entity_type text not null, entity_id uuid not null,
  author text, body text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  creative_id uuid references public.creatives(id) on delete set null,
  name text not null, type text, url text, width int, height int, format text,
  tags text[] default '{}', version integer not null default 1,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.research_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  creative_id uuid references public.creatives(id) on delete set null,
  title text not null, url text, source text, category text, notes text,
  tags text[] default '{}', screenshot_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.performances (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  creative_id uuid references public.creatives(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  platform text, period_start date, period_end date,
  spend numeric default 0, impressions bigint default 0, reach bigint default 0,
  clicks bigint default 0, lpv bigint default 0, conversions bigint default 0,
  leads bigint default 0, purchases bigint default 0, revenue numeric default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  creative_id uuid references public.creatives(id) on delete set null,
  title text not null, observation text, evidence text, hypothesis text, action text,
  priority text not null default 'media', status text not null default 'aberto',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null, period_start date, period_end date,
  summary text, next_tests text, data jsonb not null default '{}'::jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid,
  type text not null default 'info', title text not null, body text, link text,
  read_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor text, action text not null, entity_type text, entity_id uuid, description text,
  created_at timestamptz not null default now()
);

-- GRANTS / RLS / POLICIES for workspace-scoped tables
do $$
declare t text;
declare tables text[] := array['clients','projects','products','offers','campaigns','briefs','icps','voc_items','angles','hooks','copy_items','matrix_rows','creatives','creative_concepts','creative_directions','creative_versions','approvals','comments','assets','research_items','performances','insights','reports','notifications','activities'];
begin
  foreach t in array tables loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "members_manage" on public.%I for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id))', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- workspaces / members / profiles policies
grant select, insert, update, delete on public.workspaces to authenticated;
grant all on public.workspaces to service_role;
alter table public.workspaces enable row level security;
create policy "ws_select" on public.workspaces for select to authenticated using (public.is_workspace_member(id) or owner_id = auth.uid());
create policy "ws_insert" on public.workspaces for insert to authenticated with check (owner_id = auth.uid());
create policy "ws_update" on public.workspaces for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "ws_delete" on public.workspaces for delete to authenticated using (owner_id = auth.uid());
create trigger set_updated_at before update on public.workspaces for each row execute function public.set_updated_at();

grant select, insert, update, delete on public.workspace_members to authenticated;
grant all on public.workspace_members to service_role;
alter table public.workspace_members enable row level security;
create policy "wm_select" on public.workspace_members for select to authenticated using (user_id = auth.uid() or public.is_workspace_member(workspace_id));
create policy "wm_insert" on public.workspace_members for insert to authenticated with check (user_id = auth.uid() or exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()));
create policy "wm_update" on public.workspace_members for update to authenticated using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()));
create policy "wm_delete" on public.workspace_members for delete to authenticated using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()));

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_self" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create trigger set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create index on public.creatives (workspace_id, status);
create index on public.performances (workspace_id, creative_id);
create index on public.projects (workspace_id, client_id);