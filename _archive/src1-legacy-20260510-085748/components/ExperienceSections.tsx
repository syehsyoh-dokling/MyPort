import { useState } from "react";
import { BriefcaseBusiness, Building2, X } from "lucide-react";

type WorkItem = {
  projectName: string;
  period: string;
  role: string;
  sow: string;
  detail: string;
};

type ManagerialItem = {
  organization: string;
  period: string;
  position: string;
  status: string;
};

const workItems: WorkItem[] = [
  {
    projectName: "Freelance / Independent",
    period: "2024 - Present",
    role: "AI Developer, Creator & Trainer",
    sow: "Design, develop, and deploy AI-powered applications.",
    detail:
      "Design, develop, and deploy AI-powered applications, including chatbots, recommender systems, and predictive analytics. Fine-tune and customize LLMs and multimodal AI for domain-specific use cases. Create datasets, prompts, and workflows for AI training, content generation, and automation. Deliver training sessions, workshops, and capacity building on AI tools, prompt engineering, and applied machine learning. Produce user manuals, technical documentation, and training materials for sustainable AI adoption. Collaborate with cross-functional teams and clients to ensure ethical, secure, and scalable AI implementation. Apply Python, TensorFlow, PyTorch, OpenAI API integration, prompt engineering, SQL/NoSQL, backend/frontend development, generative AI, data annotation, training, and project implementation."
  },
  {
    projectName: "Test IO Community",
    period: "2025 - Present",
    role: "Software Tester",
    sow: "Execute exploratory and structured functional testing on web and mobile platforms.",
    detail:
      "Execute exploratory and structured functional testing on web and mobile platforms to identify critical, high, and medium severity bugs. Submit well-documented bug reports following Test IO standards, including reproducible steps, accurate severity classification, screenshots, and screencasts. Validate user stories by simulating end-user actions and provide structured feedback on successful, failed, or blocked executions. Complete How you tested summaries according to platform guidelines. Identify UI/UX inconsistencies, layout issues, broken images, outdated content, and other visual/content bugs. Perform streaming platform checks, including trick play, scrubbing, CTA responsiveness, and playback integrity across devices and browsers. Re-test previously submitted bugs to confirm fixes, provide evidence, and update test results. Maintain weekly validated bug report targets and improve continuously based on Test IO Academy feedback."
  },
  {
    projectName: "Tester Work",
    period: "2025 - Present",
    role: "Software Quality Assurance Tester",
    sow: "Execute exploratory and structured functional testing on web and mobile applications.",
    detail:
      "Execute exploratory and structured functional testing on web and mobile applications to detect critical, high, and medium severity bugs. Submit documented bug reports based on Tester Work standards, including reproducible steps, severity classification, screenshots, and screencasts. Validate assigned user stories by performing end-user scenarios and provide feedback for passed, failed, or blocked cases. Complete testing documentation and How you tested summaries. Report visual and content bugs such as layout problems, broken images, and outdated information. Test streaming platforms for trick play, scrubbing, CTA behavior, and playback integrity across devices and browsers. Re-test fixed bugs, confirm resolution, and provide supporting evidence. Meet weekly testing deliverables and follow Tester Work Academy best practices."
  },
  {
    projectName: "Alignerr",
    period: "2025 - Present",
    role: "AI Trainer - ICT Domain / Native Indonesian Language",
    sow: "Curate and review AI training datasets in Bahasa Indonesia.",
    detail:
      "Curate and review AI training datasets in Bahasa Indonesia with focus on ICT terminology and local use cases. Apply contextual labeling and annotation aligned with LLM training protocols. Develop and evaluate prompt-response scenarios for LLM assessment, providing feedback to improve linguistic, cultural, and technical relevance. Support model alignment for Indonesian ICT discourse, colloquial language, professional context, and social nuance. Collaborate asynchronously with global teams through Alignerr platform and task boards. Provide linguistic and technical insights for AI product localization. Ensure quality, consistency, and ethical integrity of AI outputs. Flag inaccuracies, bias, or culturally insensitive content and propose refinements. Focus on ICT4D, Indonesian NLP, ethical prompt design, model evaluation, cross-lingual data standardization, and validation using prompt-based LLM evaluation, annotation platforms, and agile remote workflows."
  },
  {
    projectName: "Outlier",
    period: "2025 - Present",
    role: "Multi-Modal AI Trainer, Writing Evaluator & Reviewer",
    sow: "Contribute to AI system development, refinement, and alignment.",
    detail:
      "Contribute to the development, refinement, and alignment of AI systems through domain-specific training data and evaluation of model outputs across text, image, and other content types. Deliver high-quality annotated data for supervised fine-tuning and model alignment. Evaluate AI-generated responses for quality, tone, accuracy, safety, and clarity. Provide editorial feedback across technical, creative, instructional, and conversational writing styles. Design real-world prompts and edge cases to test model behavior and limitations. Collaborate asynchronously with researchers, linguists, ethicists, and evaluators to refine guidelines and improve AI output quality."
  },
  {
    projectName: "NIPA Global ICT Portal / GIP",
    period: "2025 - December 2025",
    role: "Information Technology Service Management Consultant",
    sow: "Conduct market research and advise Korean ICT firms entering Indonesia.",
    detail:
      "Conduct market research on sector-specific demand in Indonesia. Analyze competitiveness and benchmark similar offerings. Review ICT regulations, compliance, and licensing requirements. Identify user segments and industry verticals. Recommend local partners and stakeholders such as distributors, government entities, and strategic partners. Connect Korean firms with VC networks, incubators, or accelerators. Provide guidance on business culture, negotiation, and localization strategy. Advise on technology localization, language, and infrastructure compatibility. Support go-to-market planning, including digital marketing and branding. Provide insights on legal, accounting, and financial setup for local presence. Coordinate with local experts on certifications, licensing, and operational requirements."
  },
  {
    projectName: "FHI 360 - EpiC Indonesia",
    period: "2021 - 2025",
    role: "ICT4D Manager / Head of Digital Solutions",
    sow: "Provide technical assistance for mobile, digital, and web-based tools.",
    detail:
      "Provide technical assistance to achieve EpiC program goals with emphasis on mobile, digital, and web-based tools. Train community representatives, peer outreach workers, Ministry of Health staff, and partners in using digital tools, platforms, and analytics to expand outreach and referral effectiveness. Identify barriers to HIV service uptake and address them through digital solutions in collaboration with civil society, businesses, and government. Collaborate with MOH, PHOs, DHOs, Global Fund PRs, CSOs, and the EpiC team to implement technical activities. Contribute to high-quality results based on work plans and performance monitoring plans. Manage and supervise ICT4D consultants, including SOW development, quality assurance, and junior staff support. Coordinate with USAID, MOH, and local/international partners to ensure activities meet timelines and budgets. Report regularly to the Deputy Project Director-Technical/Indonesia."
  },
  {
    projectName: "FHI 360 - LINKAGES Indonesia",
    period: "2016 - 2021",
    role: "ICT4D Advisor / Digital Health Systems Lead",
    sow: "Provide technical support for mobile, digital, and web tools.",
    detail:
      "Provide technical support to achieve LINKAGES program goals with focus on mobile, digital, and web tools. Train community representatives, outreach workers, MOH staff, and partners in using digital platforms and metrics to strengthen outreach and referrals. Identify barriers to HIV services and address them through digital solutions with civil society, private sector, and government. Coordinate with MOH, DERAP, Global Fund PRs, CSOs, and LINKAGES partners for technical implementation. Contribute to high-quality deliverables based on work plans, performance monitoring plans, and FHI 360 QA/QI standards. Produce timely and accurate technical reports for FHI 360 and USAID. Coordinate work plan activities, partner assistance, monitoring/reporting, and development of SOWs/MoUs for consultants and local institutions."
  },
  {
    projectName: "Management Systems International - SIAP / KIP RI",
    period: "2015 - 2016",
    role: "Case Management System Consultant",
    sow: "Analyze, design, code, and improve the case management system.",
    detail:
      "Analyze and interpret the CMS design and SOP. Design, code, and modify the case management system, including user needs analysis and system information changes based on KIP design. Refine the application based on KIP feedback, identified deficiencies, and technical issues. Develop user manuals and training manuals. Deliver training to KIP staff on using the integrated case management application. Develop a master plan for further CMS improvement, including interconnection analysis with ministries, departments, and local Information Commissions. Prepare a roadmap and action plan for sustainability after technical assistance. Provide technical assistance to KIP staff on improving incoming case data processing, data management, data analysis, and data placement in the e-complaint system to improve user-friendliness. Provide reports to MSI-SIAP 1 and KIP."
  },
  {
    projectName: "Management Systems International - Ombudsman RI",
    period: "2015",
    role: "IT System Analyst for Case Management System",
    sow: "Assess, review, and improve complaint handling system alignment.",
    detail:
      "Assess and review the roadmap of SP4N/NPCHS, ORI CMS, and LAPOR. Draft initial assessments and recommendations on SP4N/NPCHS roadmap, including systems, procedures, and technical requirements for alignment with ORI SIMPeL system. Modify SIMPeL to connect with NPCHS and improve transparency and accessibility for complainants. Formulate a policy brief on the SP4N/NPCHS system. Present final recommendations to the partner and MSI."
  },
  {
    projectName: "The Partnership for Governance Reform - DFAT RTR",
    period: "2014 - 2015",
    role: "Communication Specialist, Reform The Reformer",
    sow: "Plan and design communication and outreach strategies.",
    detail:
      "Plan and design communication and outreach strategies to promote RTRC and bureaucratic reform. Manage writing, development, design, production, and dissemination of publications and news releases across print, broadcast, and internet media. Conduct communication needs assessments for RTRC and bureaucratic reform. Develop a comprehensive communication and outreach strategy. Identify and develop storylines for publications, media articles, and electronic media materials. Edit, publish, and disseminate materials. Use social media to complement RTRC messaging. Build strategic partnerships with media counterparts and networks. Strengthen internal capacity for media outreach. Improve media and press coverage of RTRC, its strategic areas, positions, and issues. Organize press conferences, media gatherings, and media visits. Facilitate interviews with directors, senior advisors, and senior managers. Draft and disseminate press releases, advisories, backgrounders, press/media kits, and updated public information. Provide advice and technical support to RTRC management on media campaigns, initiatives, and strategies. Manage social media campaigns and engagement."
  },
  {
    projectName: "USAID IKAT-US",
    period: "2014",
    role: "ICT Specialist / Knowledge Resource Center Lead",
    sow: "Plan, implement, and maintain the IKAT-US Knowledge Resource Center.",
    detail:
      "Coordinate closely with USAID and six lead partners across six partnership programs in nine ASEAN countries. Maintain working relationships with regional partners. Plan, implement, and maintain the IKAT-US web-based Knowledge Resource Center in consultation with Component 1 partnerships and USAID. Build and maintain e-communication within the partnership by optimizing knowledge sharing and cross-learning. Facilitate linkages among IKAT-US partnership members to share best practices, build sustainable regional CSO networks, and suggest future focus areas and countries. Conduct outreach through social media and existing networks. Assist Component 1 partnerships in compiling and repackaging project activity information for website submission. Provide inputs for monthly activity and quarterly reports. Support knowledge management and e-learning. Assist regional and international forums for sharing lessons learned, exchanging good practices, and networking among partner organizations. Collect, compile, and supply website content for upload. Coordinate with partners on website content and conduct technical website maintenance."
  },
  {
    projectName: "Management Systems International - USAID SIAP / PAN-RB",
    period: "2013",
    role: "Complaint Handling System Consultant",
    sow: "Assess, design, and improve electronic complaint handling systems.",
    detail:
      "Assess the existing CHS of the Ministry of Administrative and Bureaucratic Reform. Design and modify the e-Complaint System, including user needs analysis. Present analyses and recommendations to improve electronic complaint handling and communication flow using the e-CHS application. Develop a master plan for CHS, including interconnection analysis with other organizations. Prepare the roadmap, communication strategy, and action plan for community complaint handling management. Develop user manuals. Provide technical assistance to finalize SOPs, code of ethics, and job descriptions. Provide training and technical assistance to Ministry staff."
  },
  {
    projectName: "RTI International - USAID EMAS",
    period: "2012",
    role: "ICT Specialist",
    sow: "Support citizen gateway and electronic referral system development.",
    detail:
      "Support the ICT Advisor in formulating and designing the citizen gateway and electronic referral system in North Sumatra as the EMAS pilot project. Support development of mobile and internet applications. Deliver training on computers and ICT tools to district-level health officials. Meet provincial and district counterparts to identify ways the project could leverage ICT, in collaboration with RSUP Adam Malik, the Provincial Communications Office, and the Health Office. Support systems for learning and performance improvement for health officials and call center emergency systems. Support public health messaging using ICT to influence public opinion. Support the EMAS-Pusdatin Kemenkes collaboration, where Pusdatin developed a web service-based system and EMAS developed an SMS service-based system. Assist the ICT Advisor in seeking private-sector partnerships and conduct cooperation discussions with TELKOMSEL and TELKOM regional offices."
  },
  {
    projectName: "City Facilitator - EHRA / Sanitation Program",
    period: "2010 - 2011",
    role: "City Facilitator",
    sow: "Facilitate EHRA studies and sanitation strategy development.",
    detail:
      "Facilitate the Local Government Working Group in conducting EHRA studies. Support the Working Group in formulating medium-term strategic planning to implement national sanitation regulations at local level through City Sanitation Strategy. Facilitate the development of the Program Memorandum. Strengthen capacity building through training and technical assistance for the water and sanitation working group, POKJA AMPL."
  },
  {
    projectName: "RTI International - USAID LGSP",
    period: "2005 - 2009",
    role: "Local Government Management System Specialist",
    sow: "Support local government systems, public services, and governance reform.",
    detail:
      "Serve as Local Government Management System Specialist for USAID-LGSP in Aceh Province. Support the provincial government in drafting and implementing locally funded action plans prepared by 11 districts/municipalities. Conduct capacity-building activities at provincial level in coordination with districts. Strengthen the Provincial BADIKLAT for replication and sustainability. Provide advice and input on local government program design for public service improvement and good governance. Support and strengthen CSOs and the legislature in participatory planning and budgeting. Provide technical assistance to selected SKPD stakeholders on improving public service quality in economic public services, management information systems, citizen gateway, complaint handling, SMS/web-based electronic procurement systems, institutional development and reform, education services, health services, solid waste management, and drinking water supply."
  },
  {
    projectName: "World Health Organization - Aceh-Nias Emergency Response",
    period: "2005",
    role: "ICT Officer",
    sow: "Manage emergency communications, network operations, and system implementation.",
    detail:
      "Act as liaison officer to maintain communication with multiple stakeholders, especially Provincial and District Health Offices and donor agencies. Manage overall network operations and system implementation, including installation, configuration, testing, and maintenance of HF, VHF, GPS, GPN, and satellite phones. Handle UN inter-agency communication issues. Assist the Field Security Officer with security updates and information flow after the earthquake, including MEDIVAC. Monitor communication networks in Banda Aceh, Calang, Meulaboh, and Nias. Handle partner interconnections and administrative management. Diagnose and maintain communication systems."
  }
];

const managerialItems: ManagerialItem[] = [
  {
    organization: "Dand&Dad",
    period: "2025 - Present",
    position: "Commissioner, AI Developer Company",
    status: "Start up"
  },
  {
    organization: "FHI 360",
    period: "2021 - 2025",
    position: "ICT Program Manager",
    status: "NGO"
  },
  {
    organization: "MUWAHID UMROH Backpacker",
    period: "2024 - Present",
    position: "Initiator & Founder",
    status: "Start up"
  },
  {
    organization: "Desa Wisata Puncak Manik",
    period: "2016 - Present",
    position: "Initiator & Founder",
    status: "UMKM / Start up"
  },
  {
    organization: "Himpunan Pengusaha Muda (HIMPI) Kota Banda Aceh",
    period: "2006 - 2010",
    position: "Head of Innovation Division",
    status: "Social Organization"
  },
  {
    organization: "Ikatan Pemuda Pelajar & Mahasiswa Sabang",
    period: "1999 - 2001",
    position: "Chairperson",
    status: "Social Organization"
  },
  {
    organization: "Himpunan Mahasiswa Teknik Kimia (HIMTEK)",
    period: "2000 - 2001",
    position: "Chairperson of HIMTEK, Faculty of Engineering, USK",
    status: "Intra Campus Organization"
  },
  {
    organization: "Unit Kegiatan Mahasiswa (UKM) Bridge USK",
    period: "1999 - 2000",
    position: "Chairperson",
    status: "Intra Campus Organization"
  },
  {
    organization: "Unit Kegiatan Mahasiswa (UKM) Bridge USK",
    period: "1997 - 1998",
    position: "General Secretary",
    status: "Intra Campus Organization"
  },
  {
    organization: "Pergerakan Mahasiswa Islam Indonesia (PMII)",
    period: "1998 - 1999",
    position: "Branch Secretary, Banda Aceh City",
    status: "Social Organization (Extra Campus)"
  },
  {
    organization: "Pergerakan Mahasiswa Islam Indonesia (PMII)",
    period: "1997 - 1998",
    position: "Chairperson, Syiah Kuala University Commissariat, Banda Aceh",
    status: "Social Organization (Extra Campus)"
  }
];

export function ExperienceSections() {
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [selectedManagerial, setSelectedManagerial] = useState<ManagerialItem | null>(null);

  return (
    <section id="work-experience" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="mb-8 flex items-center gap-3 text-teal-700">
            <BriefcaseBusiness size={30} strokeWidth={2.3} />
            <h2 className="font-display text-[clamp(1.35rem,1.85vw,1.9rem)] font-black leading-none text-teal-800">
              Work Experience
            </h2>
          </div>

          <div className="relative space-y-4 before:absolute before:left-[13px] before:top-3 before:h-[calc(100%-24px)] before:w-[2px] before:bg-teal-100">
            {workItems.map((item) => (
              <div key={item.projectName} className="relative grid gap-1 pl-10">
                <span className="absolute left-0 top-1.5 h-7 w-7 rounded-full border-4 border-teal-100 bg-teal-700 shadow-sm" />

                <div className="grid min-w-0 gap-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h3
                      className="min-w-0 flex-1 truncate text-[14px] font-black leading-snug text-slate-950"
                      title={item.projectName}
                    >
                      {item.projectName}
                    </h3>

                    <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-black text-teal-700 ring-1 ring-teal-100">
                      {item.period}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="min-w-0 flex-1 truncate font-[Arial] text-[11px] leading-[1.35] text-slate-600"
                      title={`Role: ${item.role} | SOW: ${item.sow}`}
                    >
                      Role: {item.role} | SOW: {item.sow}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedWork(item)}
                      className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-black text-teal-700 ring-1 ring-teal-100 transition hover:bg-teal-100"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article
          id="managerial-experience"
          className="scroll-mt-28 rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur"
        >
          <div className="mb-8 flex items-center gap-3 text-orange-600">
            <Building2 size={30} strokeWidth={2.3} />
            <h2 className="font-display text-[clamp(1.35rem,1.85vw,1.9rem)] font-black leading-none text-orange-700">
              Managerial Experience
            </h2>
          </div>

          <div className="relative space-y-4 before:absolute before:left-[13px] before:top-3 before:h-[calc(100%-24px)] before:w-[2px] before:bg-orange-100">
            {managerialItems.map((item) => (
              <div key={`${item.organization}-${item.period}-${item.position}`} className="relative grid gap-1 pl-10">
                <span className="absolute left-0 top-1.5 h-7 w-7 rounded-full border-4 border-orange-100 bg-orange-600 shadow-sm" />

                <div className="grid min-w-0 gap-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h3
                      className="min-w-0 flex-1 truncate text-[14px] font-black leading-snug text-slate-950"
                      title={item.organization}
                    >
                      {item.organization}
                    </h3>

                    <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-700 ring-1 ring-orange-100">
                      {item.period}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="min-w-0 flex-1 truncate font-[Arial] text-[11px] leading-[1.35] text-slate-600"
                      title={`${item.position} | ${item.status}`}
                    >
                      {item.position} | {item.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedManagerial(item)}
                      className="shrink-0 rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-black text-orange-700 ring-1 ring-orange-100 transition hover:bg-orange-100"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      {selectedWork ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-7 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-5">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.22em] text-teal-700">
                  Scope of Work
                </div>

                <h3 className="mt-2 font-display text-xl font-black leading-tight text-slate-950">
                  {selectedWork.projectName}
                </h3>

                <div className="mt-2 text-sm font-bold text-slate-500">
                  {selectedWork.period} | {selectedWork.role}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <p className="font-[Arial] text-sm leading-7 text-slate-700">
              {selectedWork.detail}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedManagerial ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-7 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-5">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.22em] text-orange-700">
                  Managerial Experience
                </div>

                <h3 className="mt-2 font-display text-xl font-black leading-tight text-slate-950">
                  {selectedManagerial.organization}
                </h3>

                <div className="mt-2 text-sm font-bold text-slate-500">
                  {selectedManagerial.period}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedManagerial(null)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 font-[Arial] text-sm leading-7 text-slate-700">
              <div>
                <div className="font-black text-slate-950">Position</div>
                <div>{selectedManagerial.position}</div>
              </div>

              <div>
                <div className="font-black text-slate-950">Organization Status</div>
                <div>{selectedManagerial.status}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedManagerial(null)}
                className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ExperienceSections;