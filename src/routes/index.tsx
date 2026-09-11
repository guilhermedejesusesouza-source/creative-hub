import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Kanban, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Creative OS — CRM e operação de criativos para tráfego pago" },
      {
        name: "description",
        content:
          "Centralize clientes, leads, pipeline, follow-ups, produção de criativos, aprovações e performance em um único sistema.",
      },
      { property: "og:title", content: "Creative OS — CRM e operação de criativos" },
      {
        property: "og:description",
        content:
          "Do briefing ao resultado: pipeline comercial, tarefas, produção criativa, aprovações e inteligência de performance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  {
    icon: Target,
    title: "CRM completo",
    body: "Leads, pipeline com 22 etapas, controle das abordagens, follow-ups numerados e motivos de perda.",
  },
  {
    icon: Kanban,
    title: "Operação diária",
    body: "Tarefas com checklist e recorrência, onboarding de clientes, reuniões e rotinas de tráfego.",
  },
  {
    icon: BarChart3,
    title: "Inteligência criativa",
    body: "Creative Score, performance por criativo, diagnósticos automáticos e iteração de vencedores.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background bg-grid-faint">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="font-display text-lg font-semibold">Creative OS</span>
        <Link
          to="/dashboard"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50"
        >
          Entrar
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="py-16 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            CRM + Produção criativa + Performance
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Toda a sua operação de <span className="text-gradient-brand">tráfego e criativos</span>{" "}
            em um só lugar.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground">
            Clientes, leads, pipeline, tarefas, briefings, produção, aprovações e resultados
            conectados pelo mesmo cliente — do primeiro contato ao criativo vencedor.
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Começar agora <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.title} className="surface-panel p-6">
              <p.icon className="size-5 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
