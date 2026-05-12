import {
  BarChart3,
  BrainCircuit,
  ClipboardCheck,
  CloudCog,
  DatabaseZap,
  Globe2,
  MonitorCog,
  Presentation,
  Target,
  UsersRound
} from "lucide-react";

type SkillItem = {
  title: string;
  detail: string;
  Icon: any;
};

const skills: SkillItem[] = [
  {
    title: "AI Engineering",
    detail:
      "OpenAI API, Bedrock, Claude, Mistral, LangChain, RAG, vector databases, prompt engineering, multimodal AI, AI-first architecture.",
    Icon: BrainCircuit
  },
  {
    title: "LLM Orchestration",
    detail:
      "Agent orchestration, multi-model routing, prompt templates, JSON-schema guardrails, evaluation harnesses, semantic caching, cost/latency-aware routing.",
    Icon: Target
  },
  {
    title: "Domain-Specific AI Products",
    detail:
      "AI assistants for umroh, fisheries, agriculture, health, halal checking, legal support, governance, tourism, education, and construction planning.",
    Icon: Globe2
  },
  {
    title: "Full-Stack Development",
    detail:
      "React, Next.js, Vue/Nuxt, TypeScript, JavaScript, Node.js, PHP, Laravel, CodeIgniter, WordPress, Drupal, Bootstrap, Tailwind.",
    Icon: MonitorCog
  },
  {
    title: "Backend Architecture",
    detail:
      "Node.js, Express, Fastify, NestJS, Rust/Axum, Python, REST services, queues, background workers, authentication, system scalability.",
    Icon: CloudCog
  },
  {
    title: "API & System Integration",
    detail:
      "REST, GraphQL, gRPC, JSON transformation, webhook-style integration, SP4N/SIMPeL-style interoperability, cross-system data exchange.",
    Icon: BarChart3
  },
  {
    title: "Data Engineering & Governance",
    detail:
      "MySQL, PostgreSQL, CloudSQL, AlloyDB, BigQuery, dbt, Trocco, ETL pipelines, dashboards, reporting automation, data validation.",
    Icon: DatabaseZap
  },
  {
    title: "Cloud & DevOps Automation",
    detail:
      "GCP, AWS, VPS, Linux, Docker, Kubernetes, Istio, Cloudflare, GitHub Actions, ArgoCD, Kustomize, Helm, Terraform.",
    Icon: CloudCog
  },
  {
    title: "Monitoring & Observability",
    detail:
      "Datadog, Sentry, Mixpanel, CloudWatch-style logging, telemetry, error tracking, prompt/output evaluation, performance monitoring.",
    Icon: BarChart3
  },
  {
    title: "QA & AI Evaluation",
    detail:
      "Functional testing, exploratory testing, regression testing, bug reports, cross-browser/device testing, AI response evaluation, pass/fail analysis.",
    Icon: ClipboardCheck
  },
  {
    title: "ICT4D & Public Sector Systems",
    detail:
      "Digital transformation for health, governance, public services, donor-funded programs, MIS, complaint handling, case management, field adoption.",
    Icon: Globe2
  },
  {
    title: "Training & Leadership",
    detail:
      "Workshops, technical documentation, user training, mentoring, cross-functional teams, government/donor coordination, Jira, Miro, Confluence.",
    Icon: UsersRound
  }
];

export function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-7xl px-5 py-10">
      <div className="text-center">
        <h2 className="font-display text-3xl font-black text-slate-900">
          Skills & Expertise
        </h2>
        <p className="mt-2 text-slate-600">
          Technical depth, AI product thinking, and implementation experience across multiple domains.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {skills.map((item) => {
          const Icon = item.Icon;

          return (
            <div
              key={item.title}
              title={item.detail}
              className="h-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Icon className="shrink-0 text-teal-700" size={28} />
                <h3 className="min-w-0 truncate whitespace-nowrap font-black leading-tight text-slate-900 text-[clamp(0.95rem,1.05vw,1.18rem)]">
                  {item.title}
                </h3>
              </div>

              <p className="mt-4 font-[Arial] text-[11px] leading-[1.45] text-slate-600">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}