-- 1. Extensões em clients
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS trade_name text,
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS sales_owner text,
  ADD COLUMN IF NOT EXISTS account_manager text,
  ADD COLUMN IF NOT EXISTS entry_date date,
  ADD COLUMN IF NOT EXISTS close_date date,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS plan text,
  ADD COLUMN IF NOT EXISTS monthly_value numeric,
  ADD COLUMN IF NOT EXISTS contract_value numeric,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'media',
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS health text NOT NULL DEFAULT 'saudavel',
  ADD COLUMN IF NOT EXISTS health_notes text,
  ADD COLUMN IF NOT EXISTS financial_status text,
  ADD COLUMN IF NOT EXISTS due_day integer,
  ADD COLUMN IF NOT EXISTS lead_id uuid;

-- 2. loss_reasons
CREATE TABLE IF NOT EXISTS public.loss_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loss_reasons TO authenticated;
GRANT ALL ON public.loss_reasons TO service_role;
ALTER TABLE public.loss_reasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage loss_reasons" ON public.loss_reasons FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loss_reasons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. leads
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  company text,
  role_title text,
  phone text,
  whatsapp text,
  email text,
  instagram text,
  website text,
  segment text,
  city text,
  state text,
  cnpj text,
  source text,
  interest_service text,
  potential_value numeric DEFAULT 0,
  owner text,
  entry_date date NOT NULL DEFAULT current_date,
  stage text NOT NULL DEFAULT 'LEAD',
  status text NOT NULL DEFAULT 'aberto',
  contact_count integer NOT NULL DEFAULT 0,
  last_contact_at timestamptz,
  next_action text,
  next_contact_on date,
  pain text,
  need text,
  budget text,
  urgency text,
  fit text,
  score integer NOT NULL DEFAULT 0,
  score_fit integer DEFAULT 0,
  score_financial integer DEFAULT 0,
  score_urgency integer DEFAULT 0,
  score_need integer DEFAULT 0,
  score_authority integer DEFAULT 0,
  score_engagement integer DEFAULT 0,
  notes text,
  tags text[] DEFAULT '{}',
  loss_reason text,
  loss_notes text,
  lost_at timestamptz,
  lost_by text,
  nurture_reason text,
  nurture_since date,
  nurture_interest text,
  nurture_potential text,
  closed_at timestamptz,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage leads" ON public.leads FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS leads_ws_stage_idx ON public.leads (workspace_id, stage);

ALTER TABLE public.clients
  ADD CONSTRAINT clients_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;

-- 4. lead_contacts
CREATE TABLE IF NOT EXISTS public.lead_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  number integer NOT NULL DEFAULT 1,
  contacted_on date NOT NULL DEFAULT current_date,
  channel text,
  result text,
  message text,
  reply text,
  notes text,
  next_contact_on date,
  author text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_contacts TO authenticated;
GRANT ALL ON public.lead_contacts TO service_role;
ALTER TABLE public.lead_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage lead_contacts" ON public.lead_contacts FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.lead_contacts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. follow_ups
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  number integer NOT NULL DEFAULT 1,
  due_on date NOT NULL DEFAULT current_date,
  done_on date,
  channel text,
  status text NOT NULL DEFAULT 'pendente',
  result text,
  notes text,
  next_action text,
  owner text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.follow_ups TO authenticated;
GRANT ALL ON public.follow_ups TO service_role;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage follow_ups" ON public.follow_ups FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.follow_ups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS follow_ups_ws_due_idx ON public.follow_ups (workspace_id, status, due_on);

-- 6. client_notes
CREATE TABLE IF NOT EXISTS public.client_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  category text NOT NULL DEFAULT 'importante',
  priority text NOT NULL DEFAULT 'media',
  author text,
  tags text[] DEFAULT '{}',
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_notes TO authenticated;
GRANT ALL ON public.client_notes TO service_role;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage client_notes" ON public.client_notes FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.client_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. crm_activities
CREATE TABLE IF NOT EXISTS public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'observacao',
  title text NOT NULL,
  body text,
  channel text,
  author text,
  happened_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_activities TO authenticated;
GRANT ALL ON public.crm_activities TO service_role;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage crm_activities" ON public.crm_activities FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.crm_activities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  creative_id uuid REFERENCES public.creatives(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'outro',
  owner text,
  priority text NOT NULL DEFAULT 'media',
  status text NOT NULL DEFAULT 'aberta',
  due_on date,
  done_at timestamptz,
  recurrence text NOT NULL DEFAULT 'nenhuma',
  recurrence_interval integer,
  notes text,
  tags text[] DEFAULT '{}',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage tasks" ON public.tasks FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS tasks_ws_due_idx ON public.tasks (workspace_id, status, due_on);

-- 9. task_checklist_items
CREATE TABLE IF NOT EXISTS public.task_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  label text NOT NULL,
  is_done boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_checklist_items TO authenticated;
GRANT ALL ON public.task_checklist_items TO service_role;
ALTER TABLE public.task_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage task_checklist_items" ON public.task_checklist_items FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.task_checklist_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. meetings + meeting_actions
CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  title text NOT NULL,
  type text,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  participants text[] DEFAULT '{}',
  objective text,
  agenda text,
  notes text,
  decisions text,
  status text NOT NULL DEFAULT 'agendada',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage meetings" ON public.meetings FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.meeting_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  description text NOT NULL,
  owner text,
  due_on date,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  is_done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_actions TO authenticated;
GRANT ALL ON public.meeting_actions TO service_role;
ALTER TABLE public.meeting_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage meeting_actions" ON public.meeting_actions FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.meeting_actions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 11. processes + process_steps
CREATE TABLE IF NOT EXISTS public.processes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  description text,
  owner text,
  default_days integer,
  recurrence text NOT NULL DEFAULT 'nenhuma',
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.processes TO authenticated;
GRANT ALL ON public.processes TO service_role;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage processes" ON public.processes FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.processes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  process_id uuid NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  default_days integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.process_steps TO authenticated;
GRANT ALL ON public.process_steps TO service_role;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage process_steps" ON public.process_steps FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.process_steps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 12. onboardings + onboarding_steps
CREATE TABLE IF NOT EXISTS public.onboardings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'em_andamento',
  started_on date NOT NULL DEFAULT current_date,
  finished_on date,
  owner text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboardings TO authenticated;
GRANT ALL ON public.onboardings TO service_role;
ALTER TABLE public.onboardings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage onboardings" ON public.onboardings FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.onboardings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  onboarding_id uuid NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  group_name text NOT NULL,
  label text NOT NULL,
  is_done boolean NOT NULL DEFAULT false,
  done_at timestamptz,
  owner text,
  notes text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_steps TO authenticated;
GRANT ALL ON public.onboarding_steps TO service_role;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage onboarding_steps" ON public.onboarding_steps FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.onboarding_steps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 13. traffic_routines
CREATE TABLE IF NOT EXISTS public.traffic_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  cadence text NOT NULL DEFAULT 'diaria',
  label text NOT NULL,
  is_done boolean NOT NULL DEFAULT false,
  last_done_at timestamptz,
  owner text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.traffic_routines TO authenticated;
GRANT ALL ON public.traffic_routines TO service_role;
ALTER TABLE public.traffic_routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage traffic_routines" ON public.traffic_routines FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.traffic_routines FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 14. import_jobs + import_errors
CREATE TABLE IF NOT EXISTS public.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  entity text NOT NULL,
  file_name text,
  mapping jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_rows integer NOT NULL DEFAULT 0,
  imported integer NOT NULL DEFAULT 0,
  updated integer NOT NULL DEFAULT 0,
  skipped integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'concluido',
  author text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.import_jobs TO authenticated;
GRANT ALL ON public.import_jobs TO service_role;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage import_jobs" ON public.import_jobs FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.import_jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.import_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  import_job_id uuid NOT NULL REFERENCES public.import_jobs(id) ON DELETE CASCADE,
  row_number integer NOT NULL DEFAULT 0,
  message text NOT NULL,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.import_errors TO authenticated;
GRANT ALL ON public.import_errors TO service_role;
ALTER TABLE public.import_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members manage import_errors" ON public.import_errors FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));