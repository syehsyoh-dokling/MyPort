import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  MousePointerClick,
  Wrench
} from "lucide-react";
import { optimizedAssetPath } from "../utils/assetPath";

type PortfolioItem = {
  section: "Digital Products" | "Engineering Tools";
  group: string;
  name: string;
  functionText: string;
  stack: string;
};

const ROTATION_MS = 2000;

const centerActionItems = [
  { label: "Universal API", icon: "API" },
  { label: "Web base app", icon: "WEB" },
  { label: "Engineering Tool", icon: "ENG" },
  { label: "utility tools", icon: "UTIL" },
  { label: "AI based", icon: "AI" },
  { label: "Devops tool", icon: "OPS" }
];

type PortfolioStatus =
  | "active-public"
  | "active-private-by-request"
  | "active-private-no-dummy"
  | "inactive-dummy-allowed"
  | "inactive-no-dummy-allowed"
  | "finishing-beta-testing"
  | "missing";

type PortfolioAppItem = {
  id: string;
  category: string;
  name: string;
  logoPath: string;
  stack: string;
  type: string;
  functionSummary: string;
  poBy: string;
  lastOwner: string;
  status: PortfolioStatus;
  statusLabel: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

const ENGTOOLITY_URL = "https://engtoolity.binsaifuddin.it.com/";
const LEGACYWORK_URL = "https://legacywork.binsaifuddin.it.com/";

const portfolioItems: PortfolioAppItem[] = [
  {
    id: "universal-api",
    category: "Universal API",
    name: "Universal API",
    logoPath: "/assets/logo-tool/tool-unapi.png",
    stack: "Node.js, PostgreSQL, REST API",
    type: "API platform",
    functionSummary: "Shared central API platform for connected digital products and services.",
    poBy: "Independent / Unapindo",
    lastOwner: "Saifuddin / AI Product Lab",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://unapi.danandad.org/"
  },
  {
    id: "ai-api-layer",
    category: "Universal API",
    name: "AI API Layer",
    logoPath: "/assets/logo-tool/tool-bootstrap.png",
    stack: "Python, REST API, LangChain, Vector DB, PostgreSQL",
    type: "AI API gateway",
    functionSummary: "Bootstrap gateway for AI API integration, routing, and service orchestration.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin / AI Product Lab",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://apiutama.danandad.com/"
  },
  {
    id: "multi-llm-middleware",
    category: "Universal API",
    name: "Multi-LLM Middleware",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Node.js, Express, Redis, PostgreSQL, LLM APIs",
    type: "Middleware",
    functionSummary: "Multi-provider LLM routing, fallback, and provider abstraction middleware.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "ai-first-layer",
    category: "Universal API",
    name: "AI First Layer",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Node.js, Express, PostgreSQL, Vue Admin, LLM APIs",
    type: "AI orchestrator",
    functionSummary: "AI-first orchestration layer for connecting product workflows with AI services.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "jaksehat-api",
    category: "Universal API",
    name: "JakSehat API",
    logoPath: "/assets/logo-tool/logo-jaksehat.jpg",
    stack: "MySQL, ETL, REST API, Node.js, Cronjob",
    type: "API service",
    functionSummary: "Data warehouse and public API service for integrated health data access.",
    poBy: "FHI 360 EpiC / Jakarta Sehat",
    lastOwner: "Government of DKI Jakarta Province",
    status: "active-private-no-dummy",
    statusLabel: "This web application is still actively used, but access is limited to specific authorized users.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "json-transformer",
    category: "Universal API",
    name: "JSON Transformer",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, JSON Schema, REST API, PostgreSQL",
    type: "Data exchange utility",
    functionSummary: "Map, validate, filter, and sync citizen complaint data into a standard JSON exchange schema.",
    poBy: "Independent / Data Exchange Utility",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "e-commerce-api",
    category: "Universal API",
    name: "E-Commerce API",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Laravel, MySQL, JWT, Payment API",
    type: "Backend API",
    functionSummary: "REST API service for custom e-commerce backend and transaction workflows.",
    poBy: "Startup Company",
    lastOwner: "Startup Company",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "universal-queue",
    category: "Universal API",
    name: "Universal Queue",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Node.js, BullMQ, Redis, PostgreSQL, Docker",
    type: "Queue service",
    functionSummary: "Queue and job orchestration service for backend automation workflows.",
    poBy: "Independent / Queue Infrastructure",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "ai-broadcast-api",
    category: "Universal API",
    name: "AI Broadcast API",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Node.js, Express, PostgreSQL, WebSocket, Streaming APIs",
    type: "Broadcast orchestration API",
    functionSummary: "API orchestration layer for AI-powered TV, streaming, and broadcast workflows.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin / AI Product Lab",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://unapi.danandad.org/docs"
  },
  {
    id: "dataintegrator",
    category: "Universal API",
    name: "DataIntegrator",
    logoPath: "/assets/app-logos/dataintegrator.png",
    stack: "Next.js, Go, MySQL",
    type: "API / integration layer",
    functionSummary: "Data integration and transformation platform for system-to-system exchange.",
    poBy: "Independent / Data Integration Lab",
    lastOwner: "Saifuddin / AI Product Lab",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://migrator.danandad.com/"
  },

  {
    id: "citizen-report-card",
    category: "Web base app",
    name: "Citizen Report Card",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "PHP, MySQL, JavaScript, Bootstrap, REST API",
    type: "Web application",
    functionSummary: "Citizen feedback and health service complaint platform.",
    poBy: "USAID-EMAS",
    lastOwner: "PHO of SUMUT Province",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "jak-track-vct-scheduler",
    category: "Web base app",
    name: "Jak-Track VCT Scheduler",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "PHP Native, MySQL, JavaScript, Bootstrap, REST API",
    type: "Web scheduler",
    functionSummary: "Mobile VCT testing scheduling system.",
    poBy: "FHI 360 LINKAGES",
    lastOwner: "Government of Jakarta Province",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://jaktrack-dinkes.jakarta.go.id/"
  },
  {
    id: "counsellor-timesheet",
    category: "Web base app",
    name: "Counsellor Timesheet",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, Chart.js, JavaScript",
    type: "Web dashboard",
    functionSummary: "Counsellor and consultant timesheet tracking system.",
    poBy: "FHI 360 LINKAGES",
    lastOwner: "FHI 360",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "jais-outreach-databank",
    category: "Web base app",
    name: "JAIS Outreach Databank",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, JavaScript, Apache",
    type: "Web databank",
    functionSummary: "Jakarta AIDS outreach databank for program monitoring.",
    poBy: "FHI 360 LINKAGES",
    lastOwner: "Government of Jakarta Province",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://databank-kpap.jakarta.go.id/"
  },
  {
    id: "cmd-outreach-database",
    category: "Web base app",
    name: "CMD Outreach Database",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, REST API, Bootstrap, DataTables",
    type: "Web database",
    functionSummary: "Outreach client management database for registered program members.",
    poBy: "FHI 360 LINKAGES",
    lastOwner: "FHI 360 registered members",
    status: "active-public",
    statusLabel: "Masih aktif digunakan, akses terbatas untuk registered members.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://cmd.bantuanteknis.id/"
  },
  {
    id: "simona-cantik",
    category: "Web base app",
    name: "Simona Cantik",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, JavaScript",
    type: "Web monitoring",
    functionSummary: "Program monitoring and field reporting platform.",
    poBy: "FHI 360 LINKAGES",
    lastOwner: "Government of Jakarta Province",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://simonacantik-dinkes.jakarta.go.id/"
  },
  {
    id: "ltfu-referral-system",
    category: "Web base app",
    name: "LTFU Referral System",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "Laravel, MySQL, Dashboard UI, REST API, Reporting Module",
    type: "Web referral system",
    functionSummary: "Lost-to-follow-up monitoring and referral system.",
    poBy: "FHI 360 EpiC",
    lastOwner: "FHI 360 registered members",
    status: "active-public",
    statusLabel: "Masih aktif digunakan, akses terbatas untuk registered members.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://banten.sedab.org/"
  },
  {
    id: "simuha-tb-monitoring",
    category: "Web base app",
    name: "SiMUHA TB Monitoring",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "Laravel, MySQL, Bootstrap, REST API",
    type: "Web monitoring",
    functionSummary: "TB case tracking and treatment monitoring system.",
    poBy: "FHI 360 EpiC / MoH",
    lastOwner: "KNCV",
    status: "inactive-no-dummy-allowed",
    statusLabel: "This application is no longer actively used. We have not yet been able to contact the owner to request permission to show you a dummy version.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "faster-system",
    category: "Web base app",
    name: "FASTER System",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "Next.js, Node.js, MySQL, Bootstrap, Reporting Engine",
    type: "Web reporting",
    functionSummary: "Planning, budgeting, and reporting system.",
    poBy: "FHI 360 EpiC",
    lastOwner: "FHI 360 registered members",
    status: "active-public",
    statusLabel: "Masih aktif digunakan, akses terbatas untuk registered members.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://faster.bantuanteknis.org/"
  },
  {
    id: "berani-bersama",
    category: "Web base app",
    name: "Berani Bersama",
    logoPath: "/assets/app-logos/berani-bersama.png",
    stack: "Laravel, MySQL, Bootstrap, JavaScript, REST API",
    type: "Web application",
    functionSummary: "HIV outreach and digital engagement platform.",
    poBy: "FHI 360 EpiC",
    lastOwner: "GWL-INA (CSO)",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "jaksehat-data-warehouse",
    category: "Web base app",
    name: "JakSehat Data Warehouse",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, JavaScript, Apache",
    type: "Web data warehouse",
    functionSummary: "Integrated health data warehouse platform.",
    poBy: "FHI 360 EpiC / Jakarta Sehat",
    lastOwner: "PHO registered members",
    status: "active-public",
    statusLabel: "Masih aktif digunakan, akses terbatas untuk PHO registered members.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://datakesehatan.jakarta.go.id/dhis-web-login/"
  },
  {
    id: "updatestatus",
    category: "Web base app",
    name: "Updatestatus",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "React, Node.js, MySQL, Barcode Scanner API",
    type: "Web application",
    functionSummary: "Individual HIV risk assessment application.",
    poBy: "FHI 360 EpiC",
    lastOwner: "FHI 360",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "citizen-gateway",
    category: "Web base app",
    name: "Citizen Gateway",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "PHP, MySQL, Bootstrap, JavaScript, Reporting Module",
    type: "Web/SMS gateway",
    functionSummary: "Citizen gateway and SMS public service platform.",
    poBy: "USAID-LGSP",
    lastOwner: "Government of Banda Aceh District",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "siduta-chs",
    category: "Web base app",
    name: "SIDUTA CHS",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, JavaScript, Reporting Module",
    type: "Web complaint system",
    functionSummary: "National complaint handling system.",
    poBy: "USAID-EMAS / PAN-RB",
    lastOwner: "Ministry of PANRB",
    status: "inactive-no-dummy-allowed",
    statusLabel: "This application is no longer actively used. We have not yet been able to contact the owner to request permission to show you a dummy version.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "e-chs",
    category: "Web base app",
    name: "e-CHS",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, REST API",
    type: "Web complaint system",
    functionSummary: "Complaint handling system for public service reporting.",
    poBy: "USAID-SIAP / MSI / PAN-RB",
    lastOwner: "Presidential Staff Office",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://www.lapor.go.id/"
  },
  {
    id: "sipsi-kip-ri",
    category: "Web base app",
    name: "SIPSI KIP RI",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, JavaScript, Linux Server",
    type: "Web CMS",
    functionSummary: "Information commission CMS and public information dispute platform.",
    poBy: "MSI-SIAP / KIP RI",
    lastOwner: "KIP RI",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://sipsi.komisiinformasi.go.id/"
  },
  {
    id: "e-ppid",
    category: "Web base app",
    name: "e-PPID",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, JavaScript",
    type: "Web public service",
    functionSummary: "Public information service platform.",
    poBy: "KIP RI",
    lastOwner: "KIP RI",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "http://e-ppid.komisiinformasi.go.id/"
  },
  {
    id: "ikat-us-krc",
    category: "Web base app",
    name: "IKAT-US KRC",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "Drupal, MySQL, Search Plugin, Bootstrap",
    type: "Web portal",
    functionSummary: "Knowledge Resource Center for program learning and public resource access.",
    poBy: "USAID IKAT-US Component 2",
    lastOwner: "Kemitraan PGR",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "sippalu-bawaslu",
    category: "Web base app",
    name: "SIPPALU Bawaslu",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, Bootstrap, JavaScript",
    type: "Web application",
    functionSummary: "Bawaslu public and administrative platform.",
    poBy: "MTI / Bawaslu RI",
    lastOwner: "BAWASLU RI",
    status: "inactive-no-dummy-allowed",
    statusLabel: "This application is no longer actively used. We have not yet been able to contact the owner to request permission to show you a dummy version.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "br-hub-portal",
    category: "Web base app",
    name: "BR-Hub Portal",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "WordPress, MySQL, Search Plugin, Bootstrap",
    type: "Web portal",
    functionSummary: "Knowledge resource center for reform and public sector learning.",
    poBy: "Kemitraan / RTR DFAT",
    lastOwner: "Kemitraan PGR",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "desamart",
    category: "Web base app",
    name: "Desamart",
    logoPath: "/assets/logo-web/web-desamart.png",
    stack: "Laravel, MySQL, JavaScript, REST API, Bootstrap",
    type: "E-commerce web app",
    functionSummary: "Village product e-commerce platform.",
    poBy: "Independent / Freelance",
    lastOwner: "Saifuddin",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "contact-tracing",
    category: "Web base app",
    name: "Contact Tracing",
    logoPath: "/assets/logo-web/web-ct.png",
    stack: "Next.js, Tailwind CSS, Static Hosting",
    type: "Web application",
    functionSummary: "COVID-19 contact tracing application for key populations.",
    poBy: "Independent Health Tech",
    lastOwner: "Saifuddin",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "vaccapp",
    category: "Web base app",
    name: "Vaccapp",
    logoPath: "/assets/logo-web/web-vac.png",
    stack: "Next.js, Tailwind CSS, JSON, Vercel",
    type: "Web application",
    functionSummary: "Mass vaccination monitoring and reporting system.",
    poBy: "COVID-19 Response",
    lastOwner: "Saifuddin",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "pondok-programmer",
    category: "Web base app",
    name: "Pondok Programmer",
    logoPath: "/assets/logo-web/web-pondok.png",
    stack: "PHP, MySQL, Bootstrap, JavaScript",
    type: "Web bootcamp platform",
    functionSummary: "Programmer bootcamp management application.",
    poBy: "Education / Bootcamp",
    lastOwner: "Saifuddin",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "prb-digital-app",
    category: "Web base app",
    name: "PRB Digital App",
    logoPath: "/assets/logo-web/web-prb.png",
    stack: "TypeScript, MySQL, REST API, Dashboard UI",
    type: "Web application",
    functionSummary: "Disaster risk reduction and emergency response digital platform.",
    poBy: "Forum PRB / Disaster Response",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://fprbdkijakarta.org/"
  },
  {
    id: "cognitive-aptitude-test",
    category: "Web base app",
    name: "Cognitive Aptitude Test",
    logoPath: "/assets/logo-web/web-cat.png",
    stack: "React, MySQL, JavaScript",
    type: "Web testing platform",
    functionSummary: "Online cognitive aptitude test platform.",
    poBy: "Independent Learning Assessment",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://cat.danandad.com/"
  },
  {
    id: "accredicore",
    category: "Web base app",
    name: "Accredicore",
    logoPath: "/assets/logo-web/web-ach.png",
    stack: "Laravel, MySQL, Bootstrap, REST API",
    type: "Web accreditation system",
    functionSummary: "Hospital and clinic accreditation management system.",
    poBy: "Independent / Accredicore",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://ach.danandad.com/"
  },
  {
    id: "ach-digital-portal",
    category: "Web base app",
    name: "ACH Digital Portal",
    logoPath: "/assets/logo-web/web-portal.png",
    stack: "TypeScript, Node.js, PostgreSQL, React",
    type: "Web portal",
    functionSummary: "ACH digital service portal.",
    poBy: "Independent / ACH",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://accredicore.danandad.com/"
  },
  {
    id: "booking-hall",
    category: "Web base app",
    name: "Booking Hall",
    logoPath: "/assets/logo-web/web-wedora.png",
    stack: "TypeScript, Node.js, PostgreSQL, React",
    type: "Web booking platform",
    functionSummary: "Booking and facility management platform.",
    poBy: "Independent",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://booking-hall.danandad.com/"
  },
  {
    id: "jejakair",
    category: "Web base app",
    name: "Jejakair",
    logoPath: "/assets/app-logos/air-tanah.png",
    stack: "React, TypeScript, Python",
    type: "AI-assisted web application",
    functionSummary: "Mencari sumber air bawah tanah pra-pengeboran dengan bantuan AI.",
    poBy: "Independent / AI Product Lab",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://jejakair.danandad.org/"
  },
  {
    id: "meuneuheun",
    category: "Web base app",
    name: "Meuneuheun",
    logoPath: "/assets/app-logos/meuneuheun.png",
    stack: "React, TypeScript, Python",
    type: "AI-assisted web application",
    functionSummary: "Asisten cerdas untuk memandu petani tambak udang dan ikan secara maksimal.",
    poBy: "Independent / AI Product Lab",
    lastOwner: "Saifuddin",
    status: "finishing-beta-testing",
    statusLabel: "This application is currently in the finalization stage. You are welcome to participate by sharing suggestions, opinions, and feedback for us to consider.",
    ctaLabel: "Lihat beta",
    ctaUrl: "https://meuneuheun.danandad.org/"
  },
  {
    id: "poligami",
    category: "Web base app",
    name: "PoligAmi",
    logoPath: "/assets/app-logos/poligami.png",
    stack: "PHP, MySQL, OpenAI API, web frontend, API backend",
    type: "Web app with AI assistant",
    functionSummary: "Islamic matchmaking and AI-guided relationship discussion platform.",
    poBy: "Independent / MUWAHID",
    lastOwner: "Saifuddin / MUWAHID",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://poligami.org/"
  },
  {
    id: "simpel-pengaduan",
    category: "Web base app",
    name: "SIMPeL/Pengaduan",
    logoPath: "/assets/logo-web/web-missing.png",
    stack: "CodeIgniter, MySQL, REST API",
    type: "Web complaint system",
    functionSummary: "Public complaint handling platform.",
    poBy: "Ombudsman RI",
    lastOwner: "Ombudsman RI",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://ombudsman.go.id/pengaduan"
  },

  {
    id: "data-pipelines",
    category: "Engineering Tool",
    name: "Data Pipelines",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, ETL, PostgreSQL, Cronjob, Queue Worker",
    type: "Automation pipeline",
    functionSummary: "Backend workflow and data processing pipeline.",
    poBy: "Independent",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "pdf-ingestion-daemon",
    category: "Engineering Tool",
    name: "PDF Ingestion Daemon",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, Requests, BeautifulSoup, SQLite, Cronjob",
    type: "Daemon / automation",
    functionSummary: "Free PDF ingestion and mass download daemon.",
    poBy: "Independent",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "ebooks-downloader",
    category: "Engineering Tool",
    name: "Ebooks Downloader",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, Requests, Calibre, JSON, PowerShell",
    type: "Automation tool",
    functionSummary: "E-book downloader and converter.",
    poBy: "Independent",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "ai-data-migrator",
    category: "Engineering Tool",
    name: "AI Data Migrator",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, PostgreSQL/MySQL, LLM API, ETL Scripts",
    type: "AI data migration tool",
    functionSummary: "AI-powered data migration and integration tool.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "pdf-to-video-pipeline",
    category: "Engineering Tool",
    name: "PDF-to-Video Pipeline",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, FFmpeg, TTS API, LLM API, Queue Worker",
    type: "Media pipeline",
    functionSummary: "PDF-to-video content generation pipeline.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "bootstrap-gateway",
    category: "Engineering Tool",
    name: "Bootstrap Gateway",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, PostgreSQL, GIS Data, Dashboard UI, AI API",
    type: "Engineering gateway",
    functionSummary: "Bootstrap gateway for standalone product deployments.",
    poBy: "Independent / GIS Intelligence",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "o2o-scheduler",
    category: "Engineering Tool",
    name: "O2O Scheduler",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "PHP, MySQL, REST API, Bootstrap, Cronjob",
    type: "Scheduler tool",
    functionSummary: "Online-to-offline outreach and testing scheduler.",
    poBy: "FHI 360 EpiC",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "latansa-data-validation",
    category: "Engineering Tool",
    name: "LATANSA Data Validation",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "PHP Native, MySQL, Sync Script, REST API, Cronjob",
    type: "Desktop/data validation",
    functionSummary: "Desktop-based beneficiary data validation and sync utility.",
    poBy: "Post-Tsunami Recovery",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "cmd-desktop-databank",
    category: "Engineering Tool",
    name: "CMD Desktop Databank",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "CodeIgniter, MySQL, Sync Script, REST API, Cronjob",
    type: "Desktop databank",
    functionSummary: "Desktop outreach databank and sync system.",
    poBy: "FHI 360 LINKAGES / Papua",
    lastOwner: "KPAP Province Papua",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },
  {
    id: "puskorinfo",
    category: "Engineering Tool",
    name: "PUSKORINFO",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "MS Access, MySQL, Desktop/Local Database",
    type: "Desktop/local database",
    functionSummary: "Post-tsunami population database system.",
    poBy: "Post-Tsunami Recovery",
    lastOwner: "Saifuddin / Legacy Work",
    status: "inactive-dummy-allowed",
    statusLabel: "This application is no longer actively used. The good news is that we have received permission to show it to you.",
    ctaLabel: "Lihat dummy",
    ctaUrl: LEGACYWORK_URL
  },

  {
    id: "sms-gateway-tool",
    category: "utility tools",
    name: "SMS Gateway Tool",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, MySQL, GSM Modem, Daemon Service",
    type: "Utility tool",
    functionSummary: "SMS gateway automation tool.",
    poBy: "USAID-LGSP",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "digital-archiver",
    category: "utility tools",
    name: "Digital Archiver",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, SQLite, Local File Storage, JSON Metadata, Search Index",
    type: "Archive utility",
    functionSummary: "Digital archive, metadata, and search utility.",
    poBy: "BRR NAD-Nias / Institutional Archive",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "data-validation-kit",
    category: "utility tools",
    name: "Data Validation Kit",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "JSON Schema, Python, PyTest, REST API",
    type: "QA utility",
    functionSummary: "JSON Schema Validation and Data Quality Toolkit.",
    poBy: "Independent QA",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "ai-security-assistant",
    category: "utility tools",
    name: "AI Security Assistant",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, OWASP ZAP/Nmap Parser, LLM API, Markdown Reports",
    type: "Security utility",
    functionSummary: "Pre-release security readiness assistant.",
    poBy: "Independent QA / Security Lab",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "medivac-inventory",
    category: "utility tools",
    name: "Medivac Inventory",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "PHP, MySQL, MapServer, GIS Layers, HTML/CSS",
    type: "Inventory utility",
    functionSummary: "Emergency inventory and communication kit management utility.",
    poBy: "WHO Aceh-Nias Emergency Response",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "ehra-gis-system",
    category: "utility tools",
    name: "EHRA GIS System",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "PHP, MySQL, ArcView, HTML/CSS",
    type: "GIS utility",
    functionSummary: "Sanitation and GIS information utility.",
    poBy: "EHRA Sanitation Program",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "check-halal",
    category: "utility tools",
    name: "Check Halal",
    logoPath: "/assets/app-logos/check-halal.png",
    stack: "OpenAI, web frontend, API backend",
    type: "AI utility",
    functionSummary: "Halal checking and product verification assistant.",
    poBy: "Independent / AI Product Lab",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://halal.danandad.org/"
  },
  {
    id: "review-obat",
    category: "utility tools",
    name: "Review Obat",
    logoPath: "/assets/app-logos/review-obat.png",
    stack: "OpenAI, web frontend, API backend",
    type: "AI health utility",
    functionSummary: "Medicine review and drug information assistant with medical disclaimer requirement.",
    poBy: "Independent / AI Product Lab",
    lastOwner: "Saifuddin",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "pentestor",
    category: "utility tools",
    name: "Pentestor",
    logoPath: "/assets/app-logos/pentestor.png",
    stack: "React, TypeScript, Python, security testing tools",
    type: "Security testing utility",
    functionSummary: "Blackbox, greybox, and whitebox testing assistant.",
    poBy: "Independent / Security Lab",
    lastOwner: "Saifuddin",
    status: "active-public",
    statusLabel: "This web application is public, and you are free to use it as an end user.",
    ctaLabel: "Buka web public",
    ctaUrl: "https://pentertor.danandad.com/"
  },

  {
    id: "muwahid-ai-forge-lab",
    category: "AI based",
    name: "Muwahid AI Forge Lab",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "React, Python, LLM APIs, Vector DB, PostgreSQL",
    type: "AI lab",
    functionSummary: "Domain-specific AI assistant forge and experimentation lab.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "ai-design-studio",
    category: "AI based",
    name: "AI Design Studio",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "React, Tailwind CSS, OpenAI, JSON Project Store",
    type: "AI creative app",
    functionSummary: "AI design workflow and prompt/UI generation studio.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "ai-book-backend",
    category: "AI based",
    name: "AI Book Backend",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Node.js, Express, SQLite, PDF Parser, LLM APIs",
    type: "AI backend service",
    functionSummary: "AI book translation backend service.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "ai-translation-agent",
    category: "AI based",
    name: "AI Translation Agent",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Python, Browser Extension, REST API, LLM APIs",
    type: "AI agent",
    functionSummary: "Web translation agent and AI translation service.",
    poBy: "Independent AI Product Lab",
    lastOwner: "Saifuddin",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "ai-love-sabang",
    category: "AI based",
    name: "AI Love Sabang",
    logoPath: "/assets/app-logos/ai-love-sabang.png",
    stack: "TBD",
    type: "AI tourism app",
    functionSummary: "AI-based tourism and destination assistant for Sabang.",
    poBy: "TBD",
    lastOwner: "TBD",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "aisisten-umroh-mandiri",
    category: "AI based",
    name: "AI Sisten Umroh Mandiri",
    logoPath: "/assets/app-logos/aisisten-umroh-mandiri.png",
    stack: "PHP, MySQL, OpenAI API, web frontend, API backend",
    type: "AI web assistant",
    functionSummary: "Independent umrah planning and guidance assistant.",
    poBy: "Independent / MUWAHID",
    lastOwner: "Saifuddin / MUWAHID",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "arah-ikan",
    category: "AI based",
    name: "Arah Ikan",
    logoPath: "/assets/app-logos/arah-ikan.png",
    stack: "AI, satellite/weather/ocean data, web dashboard",
    type: "AI web app",
    functionSummary: "Smart fish finder for small-scale fishers.",
    poBy: "Independent / Grant Proposal",
    lastOwner: "Saifuddin / AI Product Lab",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "aspri-legislator",
    category: "AI based",
    name: "ASPRI Legislator",
    logoPath: "/assets/app-logos/aspri-legislator.png",
    stack: "TBD",
    type: "AI assistant",
    functionSummary: "Legislative support, public communication, and policy workflow assistant.",
    poBy: "TBD",
    lastOwner: "TBD",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "cekgu",
    category: "AI based",
    name: "CekGu",
    logoPath: "/assets/app-logos/cekgu.png",
    stack: "TBD",
    type: "AI education assistant",
    functionSummary: "Education, teacher, and learning assistant.",
    poBy: "TBD",
    lastOwner: "TBD",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "desainer",
    category: "AI based",
    name: "DesAIhner",
    logoPath: "/assets/app-logos/desainher.png",
    stack: "TBD",
    type: "AI creative app",
    functionSummary: "AI design assistant for UI, visual, prompt, and creative concepts.",
    poBy: "TBD",
    lastOwner: "TBD",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "hai-mom",
    category: "AI based",
    name: "HAI Mom",
    logoPath: "/assets/app-logos/hai-mom.png",
    stack: "TBD",
    type: "AI health assistant",
    functionSummary: "Women, pregnancy, postpartum, and child-care support assistant.",
    poBy: "Independent / AI Product Lab",
    lastOwner: "Saifuddin",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "labour-advocate",
    category: "AI based",
    name: "Labour Advocate",
    logoPath: "/assets/app-logos/labour-advocate.png",
    stack: "TBD",
    type: "AI legal/labour assistant",
    functionSummary: "Labour rights, worker advocacy, and employment guidance assistant.",
    poBy: "TBD",
    lastOwner: "TBD",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "pandai-jalan",
    category: "AI based",
    name: "PandAI Jalan",
    logoPath: "/assets/app-logos/pandai-jalan.png",
    stack: "TBD",
    type: "AI travel/navigation assistant",
    functionSummary: "Route planning, travel guidance, mobility, and destination navigation assistant.",
    poBy: "TBD",
    lastOwner: "TBD",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },
  {
    id: "petani-mileniai",
    category: "AI based",
    name: "Petani MileniAI",
    logoPath: "/assets/app-logos/petani-mileniai.png",
    stack: "TBD",
    type: "AI agriculture assistant",
    functionSummary: "Agriculture knowledge, crop planning, and farmer support assistant.",
    poBy: "TBD",
    lastOwner: "TBD",
    status: "missing",
    statusLabel: "This application is still in progress.",
    ctaLabel: null,
    ctaUrl: null
  },

  {
    id: "deployment-toolkit",
    category: "Devops tool",
    name: "Deployment Toolkit",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Linux, Nginx, PM2, Docker, Bash, Node.js",
    type: "DevOps toolkit",
    functionSummary: "Deployment and server provisioning toolkit.",
    poBy: "Independent / DevOps Automation",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "accredicore-installer",
    category: "Devops tool",
    name: "Accredicore Installer",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Bash, PowerShell, Docker, PHP, MySQL, Nginx/Apache",
    type: "Installer",
    functionSummary: "Local deployment installer for Accredicore.",
    poBy: "Independent / Accredicore",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  },
  {
    id: "ach-installer",
    category: "Devops tool",
    name: "ACH Installer",
    logoPath: "/assets/logo-tool/tool-missing.png",
    stack: "Bash, PowerShell, Node.js, MySQL, Docker, Apache/Nginx",
    type: "Installer",
    functionSummary: "Local deployment installer for ACH.",
    poBy: "Independent / ACH",
    lastOwner: "Saifuddin / EngToolity",
    status: "active-private-by-request",
    statusLabel: "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",
    ctaLabel: "Check it out!",
    ctaUrl: ENGTOOLITY_URL
  }
];

const digitalProducts: PortfolioItem[] = [
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "Berani Bersama",
    functionText: "HIV outreach, counselling, referral, monitoring.",
    stack: "Laravel, MySQL, Bootstrap, REST API"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "JakSehat Data Warehouse",
    functionText: "Health data, outreach, reporting workflow.",
    stack: "CodeIgniter, MySQL, JS, Apache"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "Jak-Track VCT Scheduler",
    functionText: "Mobile VCT booking and clinic scheduling.",
    stack: "PHP Native, MySQL, JS, REST API"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "Counsellor Timesheet",
    functionText: "Counsellor activity and follow-up tracking.",
    stack: "CodeIgniter, MySQL, Chart.js"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "LTFU Referral System",
    functionText: "Track missed treatment and referrals.",
    stack: "Laravel, MySQL, REST API"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "JAIS Outreach Databank",
    functionText: "HIV/AIDS service data and dashboards.",
    stack: "CodeIgniter, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "CMD Outreach Database",
    functionText: "Client records, referrals, service history.",
    stack: "CodeIgniter, MySQL, DataTables"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "Simona Cantik",
    functionText: "Program monitoring and field reporting.",
    stack: "CodeIgniter, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "FASTER System",
    functionText: "Planning, budgeting, reporting workflow.",
    stack: "Next.js, Node.js, MySQL"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "SiMUHA TB Monitoring",
    functionText: "TB case tracking and treatment monitoring.",
    stack: "Laravel, MySQL, REST API"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "Citizen Report Card",
    functionText: "Health feedback and complaint reporting.",
    stack: "PHP, MySQL, Bootstrap, REST API"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "CMD Desktop Databank",
    functionText: "Provincial outreach data replication.",
    stack: "CodeIgniter, MySQL, Cronjob"
  },
  {
    section: "Digital Products",
    group: "Health, Outreach & Case Management Systems",
    name: "LATANSA Data Validation",
    functionText: "Beneficiary data input and validation.",
    stack: "PHP Native, MySQL, Sync Script"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "CMS KIP RI",
    functionText: "Public information case management.",
    stack: "CodeIgniter, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "e-CHS",
    functionText: "Complaint intake, tracking, reporting.",
    stack: "CodeIgniter, MySQL, REST API"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "e-PPID",
    functionText: "Public information request portal.",
    stack: "CodeIgniter, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "SIPPALU Bawaslu",
    functionText: "Election supervision and case records.",
    stack: "CodeIgniter, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "SP4N / SIMPeL",
    functionText: "Complaint integration and data sync.",
    stack: "REST API, JSON Schema, MySQL"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "IKAT-US KRC",
    functionText: "Knowledge portal and document library.",
    stack: "Drupal, MySQL, Search Plugin"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "Citizen Gateway",
    functionText: "Citizen complaint and SMS gateway.",
    stack: "PHP, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "SIDUTA CHS",
    functionText: "National complaint handling system.",
    stack: "CodeIgniter, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "Government & Public Service Platforms",
    name: "BR-Hub Portal",
    functionText: "Knowledge resource and document portal.",
    stack: "WordPress, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Medivac Inventory",
    functionText: "Medical evacuation and kit inventory.",
    stack: "PHP, MySQL, MapServer"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "EHRA GIS System",
    functionText: "Sanitation risk mapping and GIS records.",
    stack: "PHP, MySQL, ArcView"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Cognitive Aptitude Test",
    functionText: "Aptitude practice, scoring, progress.",
    stack: "React, MySQL, JavaScript"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Pondok Programmer",
    functionText: "Bootcamp registration and evaluation.",
    stack: "PHP, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "PUSKORINFO",
    functionText: "Post-tsunami population database.",
    stack: "MS Access, MySQL, Local DB"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Desamart",
    functionText: "Product, cart, order, payment app.",
    stack: "Laravel, MySQL, REST API"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Accredicore",
    functionText: "Hospital and clinic accreditation workflow.",
    stack: "Laravel, MySQL, Bootstrap"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "ACH Digital Portal",
    functionText: "Service requests and workflow portal.",
    stack: "TypeScript, Node.js, PostgreSQL"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Updatestatus",
    functionText: "HIV risk check and online booking.",
    stack: "React, Node.js, MySQL"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Booking Hall",
    functionText: "Hall booking and operational dashboard.",
    stack: "TypeScript, Node.js, PostgreSQL"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "PRB Digital App",
    functionText: "Flood program data and reporting.",
    stack: "TypeScript, MySQL, REST API"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Contact Tracing",
    functionText: "COVID contact tracing and monitoring.",
    stack: "Next.js, Tailwind, Static Hosting"
  },
  {
    section: "Digital Products",
    group: "GIS, Education, Archive & Web Platforms",
    name: "Vaccapp",
    functionText: "Vaccine activity planning and reporting.",
    stack: "Next.js, Tailwind, JSON"
  }
];

const engineeringTools: PortfolioItem[] = [
  {
    section: "Engineering Tools",
    group: "AI Infrastructure & Orchestration Tools",
    name: "AI First Layer",
    functionText: "Prompt routing and multi-LLM gateway.",
    stack: "Node.js, Express, PostgreSQL"
  },
  {
    section: "Engineering Tools",
    group: "AI Infrastructure & Orchestration Tools",
    name: "Multi-LLM Middleware",
    functionText: "Provider routing, fallback, logs.",
    stack: "Node.js, Redis, PostgreSQL"
  },
  {
    section: "Engineering Tools",
    group: "AI Infrastructure & Orchestration Tools",
    name: "AI API Layer",
    functionText: "Connect apps to LLM and RAG workflows.",
    stack: "Python, LangChain, Vector DB"
  },
  {
    section: "Engineering Tools",
    group: "AI Infrastructure & Orchestration Tools",
    name: "AI Broadcast API",
    functionText: "Control AI TV scripts and streams.",
    stack: "Node.js, WebSocket, PostgreSQL"
  },
  {
    section: "Engineering Tools",
    group: "AI Infrastructure & Orchestration Tools",
    name: "AI Book Backend",
    functionText: "Extract, translate, cache book pages.",
    stack: "Node.js, SQLite, PDF Parser"
  },
  {
    section: "Engineering Tools",
    group: "AI Infrastructure & Orchestration Tools",
    name: "AI Translation Agent",
    functionText: "Translate web and document content.",
    stack: "Python, Browser Extension, API"
  },
  {
    section: "Engineering Tools",
    group: "Backend, Queue & API Services",
    name: "Universal Queue",
    functionText: "Workers, scheduled jobs, retries.",
    stack: "Node.js, BullMQ, Redis"
  },
  {
    section: "Engineering Tools",
    group: "Backend, Queue & API Services",
    name: "Universal API",
    functionText: "Reusable backend for sectoral systems.",
    stack: "Node.js, PostgreSQL, REST"
  },
  {
    section: "Engineering Tools",
    group: "Backend, Queue & API Services",
    name: "JakSehat API",
    functionText: "Health warehouse and public endpoints.",
    stack: "Node.js, MySQL, ETL"
  },
  {
    section: "Engineering Tools",
    group: "Backend, Queue & API Services",
    name: "E-Commerce API",
    functionText: "Products, carts, orders, payments.",
    stack: "Laravel, MySQL, JWT"
  },
  {
    section: "Engineering Tools",
    group: "Backend, Queue & API Services",
    name: "Data Pipelines",
    functionText: "Process, transform, automate data.",
    stack: "Python, ETL, PostgreSQL"
  },
  {
    section: "Engineering Tools",
    group: "Backend, Queue & API Services",
    name: "JSON Transformer",
    functionText: "Map, validate, sync API data.",
    stack: "Python, JSON Schema, REST"
  },
  {
    section: "Engineering Tools",
    group: "Backend, Queue & API Services",
    name: "O2O Scheduler",
    functionText: "Link outreach to testing schedules.",
    stack: "PHP, MySQL, Cronjob"
  },
  {
    section: "Engineering Tools",
    group: "Data Acquisition, Conversion & Media Pipelines",
    name: "PDF Ingestion Daemon",
    functionText: "Find, download, organize free PDFs.",
    stack: "Python, BeautifulSoup, SQLite"
  },
  {
    section: "Engineering Tools",
    group: "Data Acquisition, Conversion & Media Pipelines",
    name: "Ebooks Downloader",
    functionText: "Download EPUB and convert to PDF.",
    stack: "Python, Calibre, PowerShell"
  },
  {
    section: "Engineering Tools",
    group: "Data Acquisition, Conversion & Media Pipelines",
    name: "PDF-to-Video Pipeline",
    functionText: "Turn PDF into video-ready assets.",
    stack: "Python, FFmpeg, TTS API"
  },
  {
    section: "Engineering Tools",
    group: "Data Acquisition, Conversion & Media Pipelines",
    name: "AI Data Migrator",
    functionText: "Map, clean, integrate system data.",
    stack: "Python, PostgreSQL, LLM API"
  },
  {
    section: "Engineering Tools",
    group: "Data Acquisition, Conversion & Media Pipelines",
    name: "Bootstrap Gateway",
    functionText: "Groundwater and GIS decision support.",
    stack: "Python, PostgreSQL, GIS"
  },
  {
    section: "Engineering Tools",
    group: "Deployment, Installer & DevOps Tools",
    name: "Deployment Toolkit",
    functionText: "Server setup and app deployment.",
    stack: "Linux, Nginx, Docker, PM2"
  },
  {
    section: "Engineering Tools",
    group: "Deployment, Installer & DevOps Tools",
    name: "Accredicore Installer",
    functionText: "Install and configure Accredicore.",
    stack: "PowerShell, Docker, MySQL"
  },
  {
    section: "Engineering Tools",
    group: "Deployment, Installer & DevOps Tools",
    name: "ACH Installer",
    functionText: "Install and configure ACH services.",
    stack: "PowerShell, Node.js, Docker"
  },
  {
    section: "Engineering Tools",
    group: "QA, Security & Operations Tools",
    name: "Data Validation Kit",
    functionText: "Validate complaint data schemas.",
    stack: "JSON Schema, Python, PyTest"
  },
  {
    section: "Engineering Tools",
    group: "QA, Security & Operations Tools",
    name: "AI Security Assistant",
    functionText: "Review risks before beta release.",
    stack: "Python, OWASP ZAP, LLM API"
  },
  {
    section: "Engineering Tools",
    group: "QA, Security & Operations Tools",
    name: "Muwahid AI Forge Lab",
    functionText: "Prototype domain-specific AI assistants.",
    stack: "React, Python, Vector DB"
  },
  {
    section: "Engineering Tools",
    group: "QA, Security & Operations Tools",
    name: "Digital Archiver",
    functionText: "Index, search, transfer archives.",
    stack: "Python, SQLite, JSON Metadata"
  },
  {
    section: "Engineering Tools",
    group: "QA, Security & Operations Tools",
    name: "SMS Gateway Tool",
    functionText: "Send and receive SMS via SIM.",
    stack: "Python, MySQL, GSM Modem"
  },
  {
    section: "Engineering Tools",
    group: "QA, Security & Operations Tools",
    name: "AI Design Studio",
    functionText: "Generate UI concepts and prompts.",
    stack: "React, Tailwind, OpenAI"
  }
];

function takeSix(items: PortfolioItem[], startIndex: number) {
  return Array.from({ length: 6 }, (_, index) => {
    return items[(startIndex + index) % items.length];
  });
}

function getActiveGroup(items: PortfolioItem[], startIndex: number) {
  return items[startIndex % items.length]?.group ?? "";
}


function getSparkDelay(tone: "apps" | "tools", index: number) {
  if (tone === "apps") {
    if (index === 0 || index === 1) return "0ms";
    if (index === 2 || index === 3) return "520ms";
    return "1040ms";
  }

  if (index === 0 || index === 1) return "520ms";
  if (index === 2 || index === 3) return "1040ms";
  return "1560ms";
}


function isLightTile(tone: "apps" | "tools", index: number) {
return (
    (tone === "apps" && (index === 0 || index === 3)) ||
    (tone === "tools" && (index === 2 || index === 5))
  );
}

function getLightDelay(tone: "apps" | "tools", index: number) {
  if (tone === "apps" && index === 0) return "0ms";
  if (tone === "apps" && index === 3) return "500ms";
  if (tone === "tools" && index === 2) return "1000ms";
  if (tone === "tools" && index === 5) return "1500ms";
  return "0ms";
}

function ArrowTile({
  item,
  index,
  tone,
  showStack
}: {
  item: PortfolioItem;
  index: number;
  tone: "apps" | "tools";
  showStack: boolean;
}) {
  const gradient =
    tone === "apps"
      ? [
          "from-teal-800 via-teal-600 to-cyan-400",
          "from-teal-700 via-cyan-500 to-sky-400",
          "from-cyan-700 via-teal-500 to-emerald-400",
          "from-emerald-700 via-teal-500 to-cyan-400",
          "from-teal-600 via-emerald-500 to-lime-300",
          "from-cyan-600 via-sky-500 to-teal-400"
        ][index % 6]
      : [
          "from-orange-700 via-orange-500 to-yellow-300",
          "from-orange-600 via-amber-400 to-yellow-300",
          "from-red-600 via-orange-500 to-amber-300",
          "from-orange-700 via-red-500 to-yellow-300",
          "from-amber-600 via-orange-500 to-yellow-300",
          "from-orange-600 via-amber-500 to-red-300"
        ][index % 6];

  const directionClass = tone === "apps" ? "arrow-tile-right" : "arrow-tile-left";
return (
    <div
      key={`${item.name}-${index}`}
      className={`arrow-tile ${directionClass} ${isLightTile(tone, index) ? "light-active" : ""} bg-gradient-to-r ${gradient}`}
      style={{ animationDelay: getLightDelay(tone, index) }}
    >
      <span className="arrow-comet" />
      <span className="arrow-star arrow-star-one" />
      <span className="arrow-star arrow-star-two" />

      <div className="relative z-10">
        <div className="arrow-title">{item.name}</div>
        <div className="arrow-detail">{item.functionText}</div>
        <div className={"arrow-stack " + (showStack ? "is-visible" : "")}>
          {item.stack}
        </div>
      </div>
    </div>
  );
}

function ArrowGrid({
  items,
  offset,
  tone,
  showStack
}: {
  items: PortfolioItem[];
  offset: number;
  tone: "apps" | "tools";
  showStack: boolean;
}) {
  const visibleItems = useMemo(() => takeSix(items, offset), [items, offset]);
return (
    <div className="grid grid-cols-2 gap-3">
      {visibleItems.map((item, index) => (
        <ArrowTile
          key={`${item.name}-${offset}-${index}`}
          item={item}
          index={index}
          tone={tone}
          showStack={true}
        />
      ))}
    </div>
  );
}

function MobileList({
  items,
  open,
  tone
}: {
  items: PortfolioItem[];
  open: boolean;
  tone: "apps" | "tools";
}) {
return (
    <div className="grid gap-3">
      {items.slice(0, 6).map((item, index) => (
        <ArrowTile
          key={`${item.name}-mobile-${index}`}
          item={item}
          index={index}
          tone={tone}
          showStack={open}
        />
      ))}

      <div
        className={
          "overflow-hidden transition-all duration-300 " +
          (open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <div className="mt-3 grid gap-3">
          {items.slice(6, 18).map((item, index) => (
            <ArrowTile
              key={`${item.name}-extra-${index}`}
              item={item}
              index={index + 6}
              tone={tone}
              showStack={open}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChecklistSections() {
  const [showStack, setShowStack] = useState(false);
  const [isCenterBursting, setIsCenterBursting] = useState(false);
  const [showCenterActions, setShowCenterActions] = useState(false);
  const [selectedCenterAction, setSelectedCenterAction] = useState<string | null>(null);
  const [centerActionExpanded, setCenterActionExpanded] = useState(false);
  const [selectedCenterSubButton, setSelectedCenterSubButton] = useState<string | null>(null);
  const [floatingGlassAnchor, setFloatingGlassAnchor] = useState({ x: 640, y: 280 });

  function updateFloatingGlassAnchor(_event?: React.MouseEvent<HTMLButtonElement>) {
    return;
  }

  const expandedGlassStyle = {};

  const infoGlassStyle = {};

  
  /* STATUS_REDACTION_HELPERS_START */
  const getStatusDisplayText = (status?: string | null, fallback?: string | null) => {
    const statusMap: Record<string, string> = {
      "active-private-no-dummy":
        "This web application is still actively used, but access is limited to specific authorized users.",

      "active-dummy-allowed":
        "This application is still actively used. The good news is that the application owner has granted permission for us to show you a dummy version.",

      "active-private-dummy-allowed":
        "This application is still actively used. The good news is that the application owner has granted permission for us to show you a dummy version.",

      "inactive-no-dummy-allowed":
        "This application is no longer actively used. We have not yet been able to contact the owner to request permission to show you a dummy version.",

      "inactive-dummy-allowed":
        "This application is no longer actively used. The good news is that we have received permission to show it to you.",

      "active-public":
        "This web application is public, and you are free to use it as an end user.",

      "active-private-by-request":
        "The source code for this tool is safely stored in a GitHub repository. If you are interested, you may request access from us. To view more details, please click the button below.",

      "finishing-beta-testing":
        "This application is currently in the finalization stage. You are welcome to participate by sharing suggestions, opinions, and feedback for us to consider.",

      "finishing":
        "This application is currently in the finalization stage. You are welcome to participate by sharing suggestions, opinions, and feedback for us to consider.",

      "missing":
        "This application is still in progress.",

      "missing-implementation":
        "This application is still in progress."
    };

    if (status && statusMap[status]) {
      return statusMap[status];
    }

    if (fallback && fallback.trim().length > 0) {
      return fallback;
    }

    return "This application is still in progress.";
  };

  const getStatusButtonText = () => "Check it out!";
  /* STATUS_REDACTION_HELPERS_END */
const currentCenterItems = portfolioItems.filter(
    (item: PortfolioAppItem) => item.category === selectedCenterAction
  );
const selectedPortfolioItem =
    currentCenterItems.find(
      (item: PortfolioAppItem) => item.id === selectedCenterSubButton
    ) ?? null;
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [appsOffset, setAppsOffset] = useState(0);
  const [toolsOffset, setToolsOffset] = useState(0);


  
  function handleCenterClick() {
    if (isCenterBursting) return;

    if (centerActionExpanded || selectedCenterAction || showCenterActions) {
      setCenterActionExpanded(false);
      setSelectedCenterAction(null);
      setShowCenterActions(false);
      setShowStack(false);
      return;
    }

    setShowStack(true);
    setShowCenterActions(false);
    setSelectedCenterAction(null);
    setCenterActionExpanded(false);
    setIsCenterBursting(true);

    window.setTimeout(() => {
      setIsCenterBursting(false);
      setShowCenterActions(true);
    }, 1650);
  }

  function handleCenterActionClick(label: string, event?: React.MouseEvent<HTMLButtonElement>) {
    updateFloatingGlassAnchor(event);

    setSelectedCenterAction(label);
    setSelectedCenterSubButton(null);
    setCenterActionExpanded(false);

    window.setTimeout(() => {
      setCenterActionExpanded(true);
    }, 360);
  }

  
  function handleCenterPanelClose() {
    setCenterActionExpanded(false);
    setSelectedCenterAction(null);
    setSelectedCenterSubButton(null);
    setShowCenterActions(true);
    setShowStack(true);
  }

  
  function handleCenterSubButtonClick(id: string, event?: React.MouseEvent<HTMLButtonElement>) {
    updateFloatingGlassAnchor(event);
    setSelectedCenterSubButton(id);
  }

  function handleCenterInfoClose() {
    setSelectedCenterSubButton(null);
  }
  useEffect(() => {
    const timer = window.setInterval(() => {
      setAppsOffset((value) => (value + 2) % digitalProducts.length);
      setToolsOffset((value) => (value + 2) % engineeringTools.length);
    }, ROTATION_MS);
return () => window.clearInterval(timer);
  }, []);

  const activeAppsGroup = getActiveGroup(digitalProducts, appsOffset);
  const activeToolsGroup = getActiveGroup(engineeringTools, toolsOffset);
return (
    <section className="mx-auto max-w-7xl px-5 py-10">
            <style>{`
        .arrow-tile {
          position: relative;
          min-height: 116px;
          overflow: hidden;
          padding: 14px 18px;
          color: white;
          box-shadow: 0 16px 28px rgba(15, 23, 42, 0.16);
          animation: none;
        }

        .arrow-tile-right {
          clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%, 13px 50%);
          padding-left: 28px;
          padding-right: 28px;
        }

        .arrow-tile-left {
          clip-path: polygon(22px 0, 100% 0, calc(100% - 13px) 50%, 100% 100%, 22px 100%, 0 50%);
          padding-left: 34px;
          padding-right: 24px;
        }

        .arrow-title {
          font-size: clamp(12.5px, 0.86vw, 15px);
          line-height: 1.12;
          font-weight: 950;
          letter-spacing: -0.01em;
          text-shadow: 0 1px 4px rgba(15, 23, 42, 0.22);
        }

        .arrow-detail {
          margin-top: 5px;
          font-size: clamp(10px, 0.7vw, 12px);
          line-height: 1.22;
          font-weight: 800;
          opacity: 0.94;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
        }

        .arrow-stack {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          margin-top: 0;
          font-size: clamp(9.5px, 0.66vw, 11px);
          line-height: 1.2;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.96);
          transition: max-height 260ms ease, opacity 260ms ease, margin-top 260ms ease;
          text-shadow: 0 1px 4px rgba(15, 23, 42, 0.22);
        }

        .arrow-stack.is-visible {
          max-height: 36px;
          opacity: 1;
          margin-top: 7px;
        }

        .arrow-comet {
          position: absolute;
          inset: -45% auto auto -40%;
          width: 62%;
          height: 210%;
          transform: rotate(24deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent);
          animation: none;
          opacity: 0;
        }

        .arrow-star {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: white;
          box-shadow:
            0 0 8px rgba(255,255,255,0.98),
            0 0 18px rgba(255,255,255,0.72);
          opacity: 0;
          animation: none;
        }

        .arrow-star-one {
          top: 12px;
          left: 72%;
          animation-delay: inherit;
        }

        .arrow-star-two {
          top: 18px;
          right: 12%;
          animation-delay: inherit;
        }


        .arrow-tile.light-active .arrow-comet {
          animation: cometSweep 2000ms ease-in-out infinite;
          animation-delay: inherit;
        }

        .arrow-tile.light-active .arrow-star {
          animation: starDrop 2000ms ease-in-out infinite;
          animation-delay: inherit;
        }

        .arrow-tile.light-active {
          animation: arrowFlash 2000ms ease-in-out infinite;
          animation-delay: inherit;
        }


        .center-orb-button {
          position: relative;
          transform-origin: center;
          will-change: transform, filter;
          isolation: isolate;
        }

        .center-orb-button::before,
        .center-orb-button::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          opacity: 0;
          pointer-events: none;
          z-index: -1;
        }

        .center-orb-button::before {
          inset: -30px;
          border: 9px solid rgba(20, 184, 166, 0.44);
          box-shadow:
            0 0 0 12px rgba(245, 158, 11, 0.20),
            0 0 42px rgba(20, 184, 166, 0.58),
            0 0 82px rgba(245, 158, 11, 0.50),
            inset 0 0 34px rgba(255, 255, 255, 0.55);
        }

        .center-orb-button::after {
          inset: -46px;
          background:
            radial-gradient(circle at 13% 28%, rgba(20,184,166,1) 0 9px, transparent 11px),
            radial-gradient(circle at 23% 78%, rgba(245,158,11,1) 0 10px, transparent 12px),
            radial-gradient(circle at 50% 4%, rgba(255,255,255,1) 0 7px, transparent 9px),
            radial-gradient(circle at 82% 19%, rgba(245,158,11,1) 0 11px, transparent 13px),
            radial-gradient(circle at 90% 68%, rgba(20,184,166,1) 0 9px, transparent 11px),
            radial-gradient(circle at 58% 94%, rgba(245,158,11,1) 0 8px, transparent 10px);
          filter:
            drop-shadow(0 0 18px rgba(245,158,11,0.70))
            drop-shadow(0 0 24px rgba(20,184,166,0.50));
        }

        .center-orb-bursting {
          animation: centerOrbBurst 1650ms cubic-bezier(.15,.82,.12,1) forwards;
          filter:
            drop-shadow(0 0 30px rgba(245, 158, 11, 0.76))
            drop-shadow(0 0 46px rgba(20, 184, 166, 0.50));
        }

        .center-orb-bursting::before {
          animation: centerShockwave 1650ms ease-out forwards;
        }

        .center-orb-bursting::after {
          animation: centerParticles 1650ms ease-out forwards;
        }

        .center-floating-actions {
          width: 0;
          height: 0;
          transform: translate(-50%, -50%);
        }

        .center-floating-slot {
          --angle: 0deg;
          --radius: 165px;
          --delay: 0ms;
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          pointer-events: auto;
          transform:
            translate(-50%, -50%)
            rotate(var(--angle))
            translate(var(--radius))
            rotate(calc(var(--angle) * -1));
          animation:
            centerActionOrbitIn 620ms cubic-bezier(.16,.9,.18,1) both,
            centerFloatingDrift 4200ms ease-in-out infinite;
          animation-delay: var(--delay), calc(var(--delay) + 620ms);
          transform-origin: center;
          will-change: transform, opacity, filter;
        }

        .center-floating-actions.is-selecting .center-floating-slot {
          pointer-events: none;
        }

        .center-floating-actions.is-selecting .center-floating-slot.is-muted {
          animation: centerActionReturnToOrb 620ms cubic-bezier(.22,.78,.18,1) forwards;
        }

        .center-floating-actions.is-selecting .center-floating-slot.is-selected {
          z-index: 80;
          animation: centerSelectedFlashGrow 760ms cubic-bezier(.16,.9,.18,1) forwards;
        }

        .center-floating-glass-action {
          display: flex;
          width: 178px;
          min-height: 52px;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.70);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.46), rgba(240,253,250,0.18)),
            radial-gradient(circle at 25% 20%, rgba(255,255,255,0.66), transparent 44%);
          padding: 8px 12px;
          color: rgba(15, 39, 59, 0.92);
          font-weight: 900;
          box-shadow:
            0 14px 30px rgba(15,23,42,0.12),
            0 0 18px rgba(20,184,166,0.10),
            inset 0 1px 0 rgba(255,255,255,0.88),
            inset 0 -1px 0 rgba(255,255,255,0.20);
          backdrop-filter: blur(18px) saturate(1.32);
          -webkit-backdrop-filter: blur(18px) saturate(1.32);
          cursor: pointer;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .center-floating-glass-action:hover {
          transform: translateY(-2px) scale(1.02);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.66), rgba(204,251,241,0.34)),
            radial-gradient(circle at 25% 20%, rgba(255,255,255,0.86), transparent 44%);
          box-shadow:
            0 18px 38px rgba(15,23,42,0.16),
            0 0 28px rgba(20,184,166,0.20),
            inset 0 1px 0 rgba(255,255,255,0.96);
        }

        .center-floating-glass-icon {
          display: grid;
          min-width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255,255,255,0.74), rgba(255,255,255,0.30));
          color: #0f766e;
          font-size: 11px;
          font-weight: 1000;
          letter-spacing: -0.03em;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.88),
            0 7px 16px rgba(15,23,42,0.10);
        }

        .center-floating-glass-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          line-height: 1.12;
          letter-spacing: -0.01em;
        }

        .center-expanded-glass {
          width: min(75vw, 920px);
          min-height: min(72vh, 620px);
          transform: translate(-50%, -50%);
          border-radius: 38px;
          border: 1px solid rgba(255,255,255,0.74);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.44), rgba(240,253,250,0.18)),
            radial-gradient(circle at 20% 10%, rgba(255,255,255,0.70), transparent 36%),
            radial-gradient(circle at 80% 90%, rgba(20,184,166,0.14), transparent 42%);
          box-shadow:
            0 35px 90px rgba(15,23,42,0.28),
            0 0 42px rgba(20,184,166,0.18),
            inset 0 1px 0 rgba(255,255,255,0.90),
            inset 0 -1px 0 rgba(255,255,255,0.24);
          backdrop-filter: blur(24px) saturate(1.35);
          -webkit-backdrop-filter: blur(24px) saturate(1.35);
          padding: 22px;
          animation: centerExpandedGlassIn 520ms cubic-bezier(.16,.9,.18,1) both;
        }

        .center-expanded-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.28);
          padding: 16px 18px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);
        }

        .center-expanded-eyebrow {
          margin: 0 0 4px;
          color: rgba(15,118,110,0.92);
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .center-expanded-header h3 {
          margin: 0;
          color: #123047;
          font-size: clamp(22px, 3vw, 36px);
          font-weight: 1000;
          letter-spacing: -0.04em;
        }

        .center-expanded-close {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.72);
          background: rgba(255,255,255,0.52);
          padding: 10px 18px;
          color: #0f766e;
          font-weight: 1000;
          box-shadow:
            0 10px 22px rgba(15,23,42,0.12),
            inset 0 1px 0 rgba(255,255,255,0.88);
          cursor: pointer;
        }

        .center-expanded-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }

        .center-expanded-placeholder {
          min-height: 86px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.66);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.58), rgba(236,254,255,0.26));
          color: #123047;
          font-size: 16px;
          font-weight: 1000;
          box-shadow:
            0 16px 34px rgba(15,23,42,0.12),
            inset 0 1px 0 rgba(255,255,255,0.86);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          cursor: pointer;
          animation: centerPlaceholderPop 420ms cubic-bezier(.16,.9,.18,1) both;
        }

        .center-expanded-placeholder:nth-child(1) { animation-delay: 40ms; }
        .center-expanded-placeholder:nth-child(2) { animation-delay: 80ms; }
        .center-expanded-placeholder:nth-child(3) { animation-delay: 120ms; }
        .center-expanded-placeholder:nth-child(4) { animation-delay: 160ms; }
        .center-expanded-placeholder:nth-child(5) { animation-delay: 200ms; }
        .center-expanded-placeholder:nth-child(6) { animation-delay: 240ms; }
        .center-expanded-placeholder:nth-child(7) { animation-delay: 280ms; }
        .center-expanded-placeholder:nth-child(8) { animation-delay: 320ms; }
        .center-expanded-placeholder:nth-child(9) { animation-delay: 360ms; }
        .center-expanded-placeholder:nth-child(10) { animation-delay: 400ms; }

        @keyframes centerOrbBurst {
          0% { transform: rotate(0deg) scale(1); }
          18% { transform: rotate(150deg) scale(1.06); }
          42% { transform: rotate(560deg) scale(1.18); }
          68% { transform: rotate(1180deg) scale(1.38); filter: brightness(1.35) saturate(1.25); }
          84% { transform: rotate(1620deg) scale(1.48); filter: brightness(1.62) saturate(1.36); }
          100% { transform: rotate(1880deg) scale(1); filter: brightness(1) saturate(1); }
        }

        @keyframes centerShockwave {
          0% { transform: scale(0.52); opacity: 0; }
          24% { opacity: 1; }
          62% { opacity: 0.78; }
          100% { transform: scale(3.35); opacity: 0; }
        }

        @keyframes centerParticles {
          0% { transform: scale(0.45) rotate(0deg); opacity: 0; }
          24% { opacity: 1; }
          72% { opacity: 0.92; }
          100% { transform: scale(3.65) rotate(260deg); opacity: 0; }
        }

        @keyframes centerActionOrbitIn {
          0% {
            opacity: 0;
            filter: blur(6px);
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(24px)
              rotate(calc(var(--angle) * -1))
              scale(0.62);
          }

          72% {
            opacity: 1;
            filter: blur(0);
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(calc(var(--radius) + 8px))
              rotate(calc(var(--angle) * -1))
              scale(1.04);
          }

          100% {
            opacity: 1;
            filter: blur(0);
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(var(--radius))
              rotate(calc(var(--angle) * -1))
              scale(1);
          }
        }

        @keyframes centerFloatingDrift {
          0%, 100% {
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(var(--radius))
              rotate(calc(var(--angle) * -1))
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(calc(var(--radius) + 6px))
              rotate(calc(var(--angle) * -1))
              translateY(-8px);
          }
        }

        @keyframes centerActionReturnToOrb {
          0% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(var(--radius))
              rotate(calc(var(--angle) * -1))
              scale(1);
            filter: blur(0);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(0)
              rotate(calc(var(--angle) * -1))
              scale(0.32);
            filter: blur(7px);
          }
        }

        @keyframes centerSelectedFlashGrow {
          0% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(var(--radius))
              rotate(calc(var(--angle) * -1))
              scale(1);
            filter: brightness(1) blur(0);
          }

          42% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(calc(var(--radius) * 0.55))
              rotate(calc(var(--angle) * -1))
              scale(1.18);
            filter: brightness(1.8) blur(0);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(var(--angle))
              translate(0)
              rotate(calc(var(--angle) * -1))
              scale(5.6);
            filter: brightness(2.5) blur(6px);
          }
        }

        @keyframes centerExpandedGlassIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.28);
            filter: blur(12px) brightness(1.8);
          }

          64% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.035);
            filter: blur(0) brightness(1.08);
          }

          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0) brightness(1);
          }
        }

        @keyframes centerPlaceholderPop {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.92);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .center-floating-slot {
            --radius: 118px !important;
          }

          .center-floating-glass-action {
            width: 132px;
            min-height: 48px;
            padding: 7px 9px;
            gap: 7px;
          }

          .center-floating-glass-icon {
            min-width: 31px;
            height: 31px;
            font-size: 9px;
          }

          .center-floating-glass-label {
            font-size: 11px;
          }

          .center-expanded-glass {
            width: 88vw;
            min-height: 72vh;
            border-radius: 28px;
            padding: 14px;
          }

          .center-expanded-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .center-expanded-placeholder {
            min-height: 64px;
            border-radius: 18px;
            font-size: 13px;
          }
        }

        .center-expanded-placeholder.is-active {
          transform: translateY(-2px) scale(1.03);
          border-color: rgba(20,184,166,0.48);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.72), rgba(204,251,241,0.38));
          box-shadow:
            0 22px 46px rgba(15,23,42,0.20),
            0 0 34px rgba(20,184,166,0.24),
            inset 0 1px 0 rgba(255,255,255,0.96);
        }

        .center-info-glass {
          position: absolute;
          left: 50%;
          top: 53%;
          width: min(68vw, 760px);
          max-height: min(66vh, 560px);
          transform: translate(-50%, -50%);
          z-index: 95;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,0.72);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.48), rgba(236,254,255,0.20)),
            radial-gradient(circle at 16% 12%, rgba(255,255,255,0.78), transparent 34%),
            radial-gradient(circle at 86% 92%, rgba(20,184,166,0.18), transparent 42%);
          box-shadow:
            0 38px 88px rgba(15,23,42,0.30),
            0 0 48px rgba(20,184,166,0.20),
            inset 0 1px 0 rgba(255,255,255,0.92),
            inset 0 -1px 0 rgba(255,255,255,0.24);
          backdrop-filter: blur(28px) saturate(1.42);
          -webkit-backdrop-filter: blur(28px) saturate(1.42);
          padding: 18px;
          overflow: hidden;
          animation: centerInfoGlassIn 460ms cubic-bezier(.16,.9,.18,1) both;
        }

        .center-info-main {
          max-height: calc(min(66vh, 560px) - 36px);
          overflow: auto;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.50);
          background: rgba(255,255,255,0.18);
          padding: 18px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.76),
            inset 0 -1px 0 rgba(255,255,255,0.16);
        }

        .center-info-main::-webkit-scrollbar {
          width: 8px;
        }

        .center-info-main::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(15,118,110,0.28);
        }

        .center-info-eyebrow {
          margin: 0 0 10px;
          color: rgba(15,118,110,0.94);
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .center-info-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .center-info-label {
          display: block;
          margin-bottom: 6px;
          color: rgba(51,65,85,0.72);
          font-size: 12px;
          font-weight: 900;
        }

        .center-info-title-row h4 {
          margin: 0;
          color: #102f46;
          font-size: clamp(22px, 3vw, 34px);
          font-weight: 1000;
          letter-spacing: -0.045em;
          line-height: 1.02;
        }

        .center-info-logo-slot {
          display: grid;
          width: 96px;
          height: 72px;
          place-items: center;
          flex-shrink: 0;
          border-radius: 22px;
          border: 1px dashed rgba(15,118,110,0.38);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.54), rgba(236,254,255,0.20));
          color: rgba(15,118,110,0.82);
          font-size: 13px;
          font-weight: 1000;
          box-shadow:
            0 12px 26px rgba(15,23,42,0.10),
            inset 0 1px 0 rgba(255,255,255,0.86);
        }

        .center-info-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .center-info-field {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.30);
          padding: 11px 12px;
          box-shadow:
            0 10px 22px rgba(15,23,42,0.08),
            inset 0 1px 0 rgba(255,255,255,0.78);
        }

        .center-info-field-wide {
          grid-column: 1 / -1;
        }

        .center-info-field span {
          display: block;
          margin-bottom: 4px;
          color: rgba(51,65,85,0.66);
          font-size: 11px;
          font-weight: 900;
        }

        .center-info-field strong {
          display: block;
          color: #123047;
          font-size: 13px;
          font-weight: 950;
          line-height: 1.25;
        }

        .center-inline-logo {
          display: inline-flex !important;
          width: fit-content;
          min-height: 30px;
          align-items: center;
          border-radius: 999px;
          border: 1px dashed rgba(15,118,110,0.36);
          padding: 6px 10px;
          background: rgba(255,255,255,0.36);
          color: rgba(15,118,110,0.88) !important;
        }

        .center-status-box {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.24);
          padding: 13px;
          box-shadow:
            0 14px 30px rgba(15,23,42,0.10),
            inset 0 1px 0 rgba(255,255,255,0.80);
        }

        .center-status-title {
          display: block;
          margin-bottom: 10px;
          color: #123047;
          font-size: 13px;
          font-weight: 1000;
        }

        .center-status-list {
          display: grid;
          gap: 8px;
        }

        .center-status-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.28);
          padding: 10px 11px;
          color: rgba(15,39,59,0.88);
          font-size: 12px;
          font-weight: 850;
          line-height: 1.25;
        }

        .center-status-item.is-muted {
          opacity: 0.68;
        }

        .center-status-item.is-actionable {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.46), rgba(240,253,250,0.24));
        }

        .center-status-item.is-public {
          background:
            linear-gradient(135deg, rgba(236,254,255,0.54), rgba(204,251,241,0.32));
          border-color: rgba(20,184,166,0.30);
        }

        .center-status-item button {
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.72);
          border-radius: 999px;
          background: rgba(255,255,255,0.58);
          padding: 7px 11px;
          color: #0f766e;
          font-size: 11px;
          font-weight: 1000;
          box-shadow:
            0 8px 18px rgba(15,23,42,0.10),
            inset 0 1px 0 rgba(255,255,255,0.86);
          cursor: pointer;
        }

        .center-status-item button:hover {
          background: rgba(255,255,255,0.78);
          box-shadow:
            0 12px 24px rgba(15,23,42,0.14),
            0 0 22px rgba(20,184,166,0.16),
            inset 0 1px 0 rgba(255,255,255,0.96);
        }

        @keyframes centerInfoGlassIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -46%) scale(0.74);
            filter: blur(12px) brightness(1.45);
          }

          72% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.025);
            filter: blur(0) brightness(1.04);
          }

          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0) brightness(1);
          }
        }

        @media (max-width: 768px) {
          .center-info-glass {
            width: 86vw;
            max-height: 68vh;
            border-radius: 26px;
            padding: 12px;
          }

          .center-info-main {
            max-height: calc(68vh - 24px);
            border-radius: 20px;
            padding: 13px;
          }

          .center-info-title-row {
            flex-direction: column;
          }

          .center-info-logo-slot {
            width: 100%;
            height: 58px;
          }

          .center-info-fields {
            grid-template-columns: 1fr;
          }

          .center-status-item {
            align-items: flex-start;
            flex-direction: column;
          }

          .center-status-item button {
            width: 100%;
          }
        }

        .center-info-x {
          position: absolute;
          right: 18px;
          top: 18px;
          z-index: 120;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.78);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.68), rgba(236,254,255,0.28));
          color: #0f766e;
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
          box-shadow:
            0 14px 30px rgba(15,23,42,0.18),
            inset 0 1px 0 rgba(255,255,255,0.92);
          backdrop-filter: blur(18px) saturate(1.32);
          -webkit-backdrop-filter: blur(18px) saturate(1.32);
          cursor: pointer;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        .center-info-x:hover {
          transform: translateY(-1px) scale(1.06);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.86), rgba(204,251,241,0.42));
          box-shadow:
            0 18px 38px rgba(15,23,42,0.22),
            0 0 26px rgba(20,184,166,0.20),
            inset 0 1px 0 rgba(255,255,255,0.98);
        }

        .postit-board {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 16px;
          padding: 6px 4px 2px;
        }

        .postit-note {
          position: relative;
          min-height: 126px;
          border-radius: 10px 28px 12px 24px;
          padding: 26px 17px 16px;
          color: rgba(40, 42, 46, 0.90);
          box-shadow:
            0 18px 30px rgba(15,23,42,0.16),
            0 3px 0 rgba(255,255,255,0.42) inset,
            0 -18px 30px rgba(15,23,42,0.05) inset;
          transform: rotate(-1.6deg);
          animation: postitPop 420ms cubic-bezier(.16,.9,.18,1) both;
          overflow: hidden;
        }

        .postit-note::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.42), transparent 38%),
            repeating-linear-gradient(
              0deg,
              transparent 0,
              transparent 27px,
              rgba(255,255,255,0.22) 28px
            );
          pointer-events: none;
        }

        .postit-note:nth-child(2) {
          transform: rotate(1.4deg);
          animation-delay: 70ms;
        }

        .postit-note:nth-child(3) {
          transform: rotate(-0.8deg);
          animation-delay: 120ms;
        }

        .postit-note:nth-child(4) {
          transform: rotate(1.9deg);
          animation-delay: 170ms;
        }

        .postit-note:nth-child(5) {
          transform: rotate(-1.1deg);
          animation-delay: 220ms;
        }

        .postit-note:nth-child(6) {
          transform: rotate(1.2deg);
          animation-delay: 270ms;
        }

        .postit-large {
          grid-column: span 2;
        }

        .postit-pin {
          position: absolute;
          left: 50%;
          top: 9px;
          z-index: 2;
          width: 15px;
          height: 15px;
          border-radius: 999px;
          transform: translateX(-50%);
          background:
            radial-gradient(circle at 35% 32%, rgba(255,255,255,0.95), transparent 32%),
            linear-gradient(135deg, #ef4444, #b91c1c);
          box-shadow:
            0 5px 10px rgba(127,29,29,0.28),
            inset 0 1px 0 rgba(255,255,255,0.58);
        }

        .postit-note small,
        .postit-note strong {
          position: relative;
          z-index: 2;
          display: block;
          font-family:
            "Comic Sans MS",
            "Segoe Print",
            "Bradley Hand ITC",
            cursive;
        }

        .postit-note small {
          margin-bottom: 8px;
          color: rgba(15,39,59,0.62);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.01em;
        }

        .postit-note strong {
          color: rgba(15,39,59,0.92);
          font-size: clamp(18px, 2.2vw, 26px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.035em;
          text-shadow: 0 1px 0 rgba(255,255,255,0.35);
        }

        .postit-yellow {
          background:
            linear-gradient(135deg, rgba(254,240,138,0.92), rgba(253,224,71,0.76));
        }

        .postit-blue {
          background:
            linear-gradient(135deg, rgba(186,230,253,0.92), rgba(125,211,252,0.74));
        }

        .postit-green {
          background:
            linear-gradient(135deg, rgba(187,247,208,0.92), rgba(134,239,172,0.72));
        }

        .postit-pink {
          background:
            linear-gradient(135deg, rgba(251,207,232,0.92), rgba(244,114,182,0.58));
        }

        .postit-orange {
          background:
            linear-gradient(135deg, rgba(254,215,170,0.94), rgba(251,146,60,0.66));
        }

        .postit-purple {
          background:
            linear-gradient(135deg, rgba(221,214,254,0.94), rgba(167,139,250,0.62));
        }

        .postit-status-box {
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.36), rgba(236,254,255,0.18));
          backdrop-filter: blur(18px) saturate(1.24);
          -webkit-backdrop-filter: blur(18px) saturate(1.24);
        }

        @keyframes postitPop {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.88) rotate(0deg);
            filter: blur(5px);
          }

          100% {
            opacity: 1;
            filter: blur(0);
          }
        }

        @media (max-width: 768px) {
          .center-info-x {
            right: 12px;
            top: 12px;
            width: 36px;
            height: 36px;
            font-size: 24px;
          }

          .postit-board {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .postit-large {
            grid-column: auto;
          }

          .postit-note {
            min-height: 112px;
            padding: 24px 14px 14px;
          }

          .postit-note strong {
            font-size: 19px;
          }
        }

        .center-expanded-glass,
        .center-info-glass {
          will-change: transform, top, left;
        }

        .center-expanded-close,
        .center-info-x {
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          letter-spacing: 0 !important;
          text-transform: none !important;
          font-weight: 800 !important;
          font-style: normal !important;
        }

        .center-expanded-close::before,
        .center-expanded-close::after,
        .center-info-x::before,
        .center-info-x::after {
          content: none !important;
          display: none !important;
        }

        .center-expanded-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 86px;
          min-height: 42px;
          padding: 0 16px;
          font-size: 15px !important;
          line-height: 1 !important;
        }

        .center-expanded-close span {
          display: inline-block;
          transform: translateY(-1px);
        }

        .center-info-x {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          padding: 0;
          font-size: 26px !important;
          line-height: 1 !important;
        }

        .postit-note,
        .postit-note small,
        .postit-note strong,
        .postit-note span,
        .postit-note p {
          font-family: "Lucida Handwriting", "Segoe Print", "Bradley Hand", cursive !important;
        }

        .postit-note small {
          font-size: 12px !important;
          line-height: 1.2 !important;
          font-weight: 700 !important;
          letter-spacing: 0 !important;
        }

        .postit-note strong {
          font-size: 14px !important;
          line-height: 1.18 !important;
          font-weight: 700 !important;
          letter-spacing: 0 !important;
        }

        .postit-note.postit-large strong {
          font-size: 14px !important;
          line-height: 1.16 !important;
        }

        .postit-board {
          gap: 14px !important;
        }

        .postit-note {
          padding: 18px 18px 16px !important;
          overflow: hidden;
        }

        .postit-note strong {
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        @media (max-width: 768px) {
          .center-expanded-glass {
            width: min(94vw, 920px) !important;
          }

          .center-info-glass {
            width: min(92vw, 980px) !important;
          }

          .center-expanded-close {
            min-width: 74px;
            min-height: 38px;
            font-size: 14px !important;
          }

          .center-info-x {
            width: 38px;
            height: 38px;
            font-size: 22px !important;
          }

          .postit-note small {
            font-size: 11px !important;
          }

          .postit-note strong {
            font-size: 12px !important;
          }
        }

        .center-expanded-glass {
          pointer-events: auto !important;
          visibility: visible !important;
          opacity: 1;
          z-index: 9990 !important;
        }

        .center-info-glass {
          pointer-events: auto !important;
          visibility: visible !important;
          z-index: 9995 !important;
        }

        .center-expanded-glass,
        .center-info-glass {
          position: fixed !important;
          will-change: left, top, transform;
          transition:
            left 220ms cubic-bezier(.16,.9,.18,1),
            top 220ms cubic-bezier(.16,.9,.18,1),
            transform 220ms cubic-bezier(.16,.9,.18,1);
        }

        .center-expanded-glass {
          max-height: 74vh !important;
          overflow: hidden !important;
        }

        .center-info-glass {
          max-height: 68vh !important;
          overflow: hidden !important;
        }

        .center-info-main {
          max-height: calc(68vh - 36px) !important;
          overflow: auto !important;
        }

        .center-expanded-glass,
        .center-info-glass {
          position: fixed !important;
          will-change: transform;
          pointer-events: auto !important;
        }

        .center-expanded-glass {
          width: min(76vw, 1120px) !important;
          max-height: 78vh !important;
          overflow: hidden !important;
          z-index: 9990 !important;
        }

        .center-info-glass {
          width: min(68vw, 860px) !important;
          max-height: 68vh !important;
          overflow: hidden !important;
          z-index: 9995 !important;
        }

        .center-info-main {
          max-height: calc(68vh - 36px) !important;
          overflow: auto !important;
        }

        @media (max-width: 768px) {
          .center-expanded-glass {
            width: 92vw !important;
            max-height: 78vh !important;
            left: 50vw !important;
            top: 50vh !important;
          }

          .center-info-glass {
            width: 88vw !important;
            max-height: 68vh !important;
            left: 50vw !important;
            top: 52vh !important;
          }
        }

        

        

        

        

        /* GLASS_AESTHETIC_REFINED_FINAL */

        /* =========================
           PANEL KACA 1
           - max 3/4 viewport
           - transparan / glass
           - centered
           ========================= */
        .center-expanded-glass {
          position: fixed !important;
          left: 50% !important;
          top: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: min(75vw, 1240px) !important;
          height: min(75vh, 720px) !important;
          max-width: min(75vw, 1240px) !important;
          max-height: min(75vh, 720px) !important;
          padding: 24px 24px 22px !important;
          border-radius: 34px !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          z-index: 9990 !important;
          pointer-events: auto !important;

          background: rgba(255, 255, 255, 0.12) !important;
          border: 1px solid rgba(255, 255, 255, 0.32) !important;
          box-shadow:
            0 24px 60px rgba(32, 72, 92, 0.18),
            inset 0 1px 0 rgba(255,255,255,0.32) !important;
          backdrop-filter: blur(18px) saturate(130%) !important;
          -webkit-backdrop-filter: blur(18px) saturate(130%) !important;
        }

        .center-expanded-glass::before,
        .center-expanded-glass::after,
        .center-info-glass::before,
        .center-info-glass::after,
        .center-info-copy::before,
        .center-info-copy::after {
          content: none !important;
          display: none !important;
        }

        .center-expanded-header {
          flex: 0 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 18px !important;
          margin-bottom: 16px !important;
          padding: 16px 18px !important;
          border-radius: 28px !important;
          background: rgba(255,255,255,0.10) !important;
          border: 1px solid rgba(255,255,255,0.22) !important;
        }

        .center-expanded-header h2,
        .center-expanded-header h3,
        .center-expanded-glass h2,
        .center-expanded-glass h3 {
          margin: 0 !important;
          font-size: clamp(22px, 2.2vw, 30px) !important;
          line-height: 1.06 !important;
        }

        .center-expanded-header p,
        .center-expanded-header small {
          font-size: 11px !important;
          line-height: 1.22 !important;
        }

        .center-expanded-close {
          min-width: 102px !important;
          min-height: 48px !important;
          padding: 0 18px !important;
          font-size: 15px !important;
          border-radius: 999px !important;
          font-weight: 800 !important;
        }

        /* GRID LOGO PANEL 1 */
        .center-expanded-grid {
          flex: 1 1 auto !important;
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 18px !important;
          align-content: start !important;
          padding: 6px 4px 2px !important;
          overflow: hidden !important;
        }

        .portfolio-app-button,
        .center-expanded-placeholder {
          min-height: 118px !important;
          padding: 14px 10px !important;
          border-radius: 22px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          text-align: center !important;
          overflow: hidden !important;
          background: rgba(255,255,255,0.10) !important;
          border: 1px solid rgba(255,255,255,0.18) !important;
        }

        .portfolio-app-logo {
          width: 46px !important;
          height: 46px !important;
          object-fit: contain !important;
          border-radius: 12px !important;
          margin-bottom: 2px !important;
        }

        .portfolio-app-button span,
        .center-expanded-placeholder span {
          display: block !important;
          font-size: 13px !important;
          line-height: 1.14 !important;
          font-weight: 800 !important;
          max-width: 100% !important;
          text-wrap: balance !important;
          word-break: break-word !important;
        }

        /* =========================
           PANEL KACA 2
           - lebih kecil
           - tetap muat di dalam panel 1
           - tanpa scroll
           ========================= */
        .center-info-glass {
          position: absolute !important;
          left: 50% !important;
          top: 54% !important;
          transform: translate(-50%, -50%) !important;
          width: min(58vw, 930px) !important;
          height: min(50vh, 470px) !important;
          max-width: min(58vw, 930px) !important;
          max-height: min(50vh, 470px) !important;
          padding: 16px 18px !important;
          border-radius: 28px !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          z-index: 9995 !important;

          background: rgba(255,255,255,0.10) !important;
          border: 1px solid rgba(255,255,255,0.24) !important;
          box-shadow:
            0 18px 42px rgba(29, 58, 71, 0.14),
            inset 0 1px 0 rgba(255,255,255,0.26) !important;
          backdrop-filter: blur(14px) saturate(120%) !important;
          -webkit-backdrop-filter: blur(14px) saturate(120%) !important;
        }

        .center-info-main {
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          max-height: none !important;
          display: flex !important;
          flex-direction: column !important;
          box-sizing: border-box !important;
        }

        .center-info-copy {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }

        .center-info-title-row {
          flex: 0 0 auto !important;
          display: grid !important;
          grid-template-columns: 1fr 86px !important;
          gap: 10px !important;
          align-items: start !important;
          margin-bottom: 8px !important;
        }

        .center-info-eyebrow {
          font-size: 10px !important;
          line-height: 1.18 !important;
          letter-spacing: 0.06em !important;
          margin-bottom: 4px !important;
          text-transform: uppercase !important;
        }

        .center-info-title-row h4 {
          margin: 0 !important;
          font-size: clamp(18px, 1.8vw, 24px) !important;
          line-height: 1.06 !important;
        }

        .center-info-logo-slot {
          width: 86px !important;
          height: 86px !important;
          min-width: 86px !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(255,255,255,0.10) !important;
          border: 1px solid rgba(255,255,255,0.18) !important;
        }

        .center-info-logo-slot img {
          max-width: 56px !important;
          max-height: 56px !important;
          object-fit: contain !important;
        }

        .center-info-x {
          width: 36px !important;
          height: 36px !important;
          font-size: 20px !important;
          border-radius: 999px !important;
        }

        /* =========================
           POST-IT LAYOUT BARU
           - nama aplikasi kecil
           - stack & fungsi lebih panjang
           - semua muat dalam satu blok
           ========================= */
        .postit-board {
          flex: 1 1 auto !important;
          display: grid !important;
          grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
          gap: 10px !important;
          align-content: start !important;
          overflow: hidden !important;
          margin-top: 4px !important;
          margin-bottom: 8px !important;
        }

        .postit-note {
          min-height: 70px !important;
          padding: 10px 12px !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }

        /* Nama aplikasi - kecil saja */
        .postit-note.postit-large {
          grid-column: span 4 !important;
          min-height: 70px !important;
        }

        /* Stack - panjang */
        .postit-note.postit-blue {
          grid-column: span 8 !important;
          min-height: 82px !important;
        }

        /* Jenis - pendek */
        .postit-note.postit-green {
          grid-column: span 3 !important;
          min-height: 68px !important;
        }

        /* Fungsi - panjang */
        .postit-note.postit-pink {
          grid-column: span 5 !important;
          min-height: 78px !important;
        }

        /* PO by - sedang */
        .postit-note.postit-orange {
          grid-column: span 4 !important;
          min-height: 68px !important;
        }

        /* Last owner - kecil/sedang */
        .postit-note.postit-purple {
          grid-column: span 4 !important;
          min-height: 64px !important;
        }

        .postit-note,
        .postit-note small,
        .postit-note strong,
        .postit-note span,
        .postit-note p {
          font-family: "Lucida Handwriting", "Segoe Print", "Bradley Hand", cursive !important;
        }

        .postit-note small {
          display: block !important;
          font-size: 10px !important;
          line-height: 1.14 !important;
          margin-bottom: 5px !important;
          font-weight: 700 !important;
          letter-spacing: 0 !important;
        }

        .postit-note strong {
          display: block !important;
          font-size: 11px !important;
          line-height: 1.10 !important;
          font-weight: 700 !important;
          word-break: break-word !important;
          overflow-wrap: anywhere !important;
          letter-spacing: 0 !important;
        }

        .postit-pin {
          width: 13px !important;
          height: 13px !important;
        }

        .center-status-box.postit-status-box {
          flex: 0 0 auto !important;
          margin-top: 0 !important;
          padding: 9px 12px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          background: rgba(255,255,255,0.10) !important;
          border: 1px solid rgba(255,255,255,0.18) !important;
        }

        .center-status-title {
          font-size: 11px !important;
          line-height: 1.2 !important;
          margin-bottom: 6px !important;
        }

        .center-status-list {
          gap: 6px !important;
        }

        .center-status-item {
          gap: 8px !important;
          padding: 7px 9px !important;
          border-radius: 12px !important;
        }

        .center-status-item span {
          font-size: 10px !important;
          line-height: 1.2 !important;
        }

        .center-status-item a,
        .center-status-item button {
          font-size: 10px !important;
          padding: 6px 9px !important;
          min-height: 28px !important;
          border-radius: 999px !important;
        }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .center-expanded-glass {
            width: min(82vw, 1180px) !important;
            height: min(76vh, 720px) !important;
          }

          .center-expanded-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 16px !important;
          }

          .center-info-glass {
            width: min(66vw, 930px) !important;
            height: min(54vh, 500px) !important;
          }
        }

        @media (max-width: 820px) {
          .center-expanded-glass {
            width: 92vw !important;
            height: min(78vh, 720px) !important;
            padding: 18px !important;
          }

          .center-expanded-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 14px !important;
          }

          .portfolio-app-button,
          .center-expanded-placeholder {
            min-height: 106px !important;
          }

          .center-info-glass {
            width: 86vw !important;
            height: min(58vh, 510px) !important;
          }

          .center-info-title-row {
            grid-template-columns: 1fr 72px !important;
          }

          .center-info-logo-slot {
            width: 72px !important;
            height: 72px !important;
            min-width: 72px !important;
          }

          .postit-note.postit-large {
            grid-column: span 4 !important;
          }

          .postit-note.postit-blue {
            grid-column: span 8 !important;
          }

          .postit-note.postit-green,
          .postit-note.postit-orange,
          .postit-note.postit-purple {
            grid-column: span 4 !important;
          }

          .postit-note.postit-pink {
            grid-column: span 8 !important;
          }
        }

        @media (max-width: 640px) {
          .center-expanded-glass {
            width: 95vw !important;
            height: min(80vh, 720px) !important;
          }

          .center-expanded-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }

          .portfolio-app-logo {
            width: 40px !important;
            height: 40px !important;
          }

          .portfolio-app-button span,
          .center-expanded-placeholder span {
            font-size: 12px !important;
          }

          .center-info-glass {
            width: 92vw !important;
            height: min(62vh, 500px) !important;
          }

          .center-info-title-row {
            grid-template-columns: 1fr 60px !important;
            gap: 8px !important;
          }

          .center-info-logo-slot {
            width: 60px !important;
            height: 60px !important;
            min-width: 60px !important;
          }

          .postit-board {
            grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }

          .postit-note.postit-large,
          .postit-note.postit-blue {
            grid-column: span 6 !important;
          }

          .postit-note.postit-green,
          .postit-note.postit-orange,
          .postit-note.postit-purple {
            grid-column: span 3 !important;
          }

          .postit-note.postit-pink {
            grid-column: span 6 !important;
          }

          .postit-note {
            min-height: 62px !important;
            padding: 8px 10px !important;
          }

          .postit-note small {
            font-size: 9px !important;
          }

          .postit-note strong {
            font-size: 10px !important;
          }
        }

        /* MOJIBAKE_AND_DETAIL_COMPACT_FINAL */

        .center-info-glass {
          width: min(56vw, 880px) !important;
          height: min(48vh, 430px) !important;
          max-width: min(56vw, 880px) !important;
          max-height: min(48vh, 430px) !important;
          padding: 14px 16px !important;
          overflow: hidden !important;
          border-radius: 24px !important;
          background: rgba(255,255,255,0.12) !important;
          backdrop-filter: blur(16px) saturate(125%) !important;
          -webkit-backdrop-filter: blur(16px) saturate(125%) !important;
        }

        .center-info-glass,
        .center-info-glass * {
          max-width: 100%;
          box-sizing: border-box;
        }

        .center-info-main,
        .center-info-copy {
          height: 100% !important;
          max-height: 100% !important;
          overflow: hidden !important;
        }

        .center-info-title-row {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) 68px !important;
          gap: 10px !important;
          align-items: start !important;
          margin-bottom: 8px !important;
          overflow: hidden !important;
        }

        .center-info-title-row > div:first-child {
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .center-info-eyebrow {
          font-size: 9px !important;
          line-height: 1.1 !important;
          letter-spacing: 0.05em !important;
          margin: 0 0 3px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        .center-info-title-row h4 {
          font-size: clamp(17px, 1.6vw, 22px) !important;
          line-height: 1.05 !important;
          margin: 0 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        .center-info-logo-slot {
          width: 68px !important;
          height: 68px !important;
          min-width: 68px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }

        .center-info-logo-slot img {
          max-width: 44px !important;
          max-height: 44px !important;
          object-fit: contain !important;
        }

        .postit-board {
          display: grid !important;
          grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
          gap: 8px !important;
          margin: 4px 0 8px !important;
          overflow: hidden !important;
        }

        .postit-note {
          min-height: 58px !important;
          padding: 8px 10px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }

        .postit-note.postit-large {
          grid-column: span 4 !important;
          min-height: 58px !important;
        }

        .postit-note.postit-blue {
          grid-column: span 8 !important;
          min-height: 66px !important;
        }

        .postit-note.postit-green {
          grid-column: span 3 !important;
          min-height: 58px !important;
        }

        .postit-note.postit-pink {
          grid-column: span 5 !important;
          min-height: 70px !important;
        }

        .postit-note.postit-orange {
          grid-column: span 4 !important;
          min-height: 58px !important;
        }

        .postit-note.postit-purple {
          grid-column: span 4 !important;
          min-height: 54px !important;
        }

        .postit-note small {
          font-family: "Lucida Handwriting", "Segoe Print", cursive !important;
          font-size: 9px !important;
          line-height: 1.05 !important;
          margin-bottom: 4px !important;
          letter-spacing: 0 !important;
        }

        .postit-note strong {
          font-family: "Lucida Handwriting", "Segoe Print", cursive !important;
          font-size: 10px !important;
          line-height: 1.08 !important;
          font-weight: 700 !important;
          display: -webkit-box !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
          word-break: break-word !important;
          overflow-wrap: anywhere !important;
        }

        .postit-note.postit-large strong,
        .postit-note.postit-green strong,
        .postit-note.postit-orange strong,
        .postit-note.postit-purple strong {
          -webkit-line-clamp: 2 !important;
        }

        .postit-note.postit-blue strong,
        .postit-note.postit-pink strong {
          -webkit-line-clamp: 3 !important;
        }

        .postit-pin {
          width: 10px !important;
          height: 10px !important;
          top: 6px !important;
        }

        .center-status-box.postit-status-box {
          padding: 7px 10px !important;
          border-radius: 14px !important;
          overflow: hidden !important;
          margin-top: auto !important;
        }

        .center-status-title {
          font-size: 10px !important;
          margin-bottom: 5px !important;
        }

        .center-status-item {
          padding: 6px 8px !important;
          gap: 8px !important;
          border-radius: 12px !important;
        }

        .center-status-item span {
          font-size: 9.5px !important;
          line-height: 1.15 !important;
        }

        .center-status-item a,
        .center-status-item button {
          font-size: 9.5px !important;
          min-height: 26px !important;
          padding: 5px 8px !important;
        }

        .center-expanded-grid {
          gap: 16px !important;
        }

        .portfolio-app-logo {
          width: 42px !important;
          height: 42px !important;
        }

        .portfolio-app-button,
        .center-expanded-placeholder {
          min-height: 106px !important;
          padding: 12px 10px !important;
        }

        .portfolio-app-button span,
        .center-expanded-placeholder span {
          font-size: 12.5px !important;
          line-height: 1.12 !important;
        }

        /* GLASS_STATUS_REDACTION_FINAL */

        /* =========================
           PANEL KACA BESAR
           lebih transparan
           ========================= */
        .center-expanded-glass {
          background: rgba(255, 255, 255, 0.07) !important;
          border: 1px solid rgba(255, 255, 255, 0.22) !important;
          box-shadow:
            0 18px 48px rgba(22, 54, 66, 0.14),
            inset 0 1px 0 rgba(255,255,255,0.22) !important;
          backdrop-filter: blur(10px) saturate(118%) !important;
          -webkit-backdrop-filter: blur(10px) saturate(118%) !important;
        }

        .center-expanded-header {
          background: rgba(255,255,255,0.08) !important;
          border: 1px solid rgba(255,255,255,0.18) !important;
        }

        .portfolio-app-button,
        .center-expanded-placeholder {
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.14) !important;
        }

        /* =========================
           PANEL KACA KECIL
           lebih buram / lebih blur
           ========================= */
        .center-info-glass {
          background: rgba(255, 255, 255, 0.18) !important;
          border: 1px solid rgba(255, 255, 255, 0.26) !important;
          box-shadow:
            0 20px 44px rgba(20, 44, 58, 0.18),
            inset 0 1px 0 rgba(255,255,255,0.26) !important;
          backdrop-filter: blur(24px) saturate(140%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(140%) !important;
        }

        /* =========================
           CLOSE X - RED SPRAY PAINT
           ========================= */
        .center-info-x {
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          border: none !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,0.08) !important;
          color: #cc1515 !important;
          font-size: 28px !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-shadow:
            0 0 1px rgba(120,0,0,.45),
            0 0 10px rgba(204,21,21,.35) !important;
          transform: rotate(-5deg) !important;
          box-shadow: 0 6px 18px rgba(0,0,0,.12) !important;
          overflow: visible !important;
        }

        .center-info-x::before {
          content: "" !important;
          position: absolute !important;
          inset: -5px !important;
          border-radius: 999px !important;
          background:
            radial-gradient(circle at 30% 40%, rgba(220,20,20,.45), transparent 38%),
            radial-gradient(circle at 70% 45%, rgba(185,0,0,.38), transparent 42%),
            radial-gradient(circle at 48% 72%, rgba(255,80,80,.22), transparent 34%) !important;
          filter: blur(8px) !important;
          opacity: .92 !important;
          z-index: -1 !important;
          pointer-events: none !important;
        }

        /* =========================
           STATUS BOX - BLACK SPRAY
           ========================= */
        .center-status-box.postit-status-box {
          position: relative !important;
          background: rgba(14, 14, 14, 0.56) !important;
          border: 1px solid rgba(255,255,255,0.16) !important;
          box-shadow:
            0 12px 30px rgba(0,0,0,0.20),
            inset 0 1px 0 rgba(255,255,255,0.08) !important;
          backdrop-filter: blur(10px) saturate(118%) !important;
          -webkit-backdrop-filter: blur(10px) saturate(118%) !important;
          overflow: hidden !important;
        }

        .center-status-box.postit-status-box::before {
          content: "" !important;
          position: absolute !important;
          left: 12px !important;
          right: 12px !important;
          bottom: 10px !important;
          height: 42px !important;
          border-radius: 999px !important;
          background:
            radial-gradient(circle at 14% 50%, rgba(0,0,0,.52), transparent 18%),
            radial-gradient(circle at 34% 52%, rgba(0,0,0,.62), transparent 24%),
            radial-gradient(circle at 52% 48%, rgba(20,20,20,.56), transparent 22%),
            radial-gradient(circle at 72% 52%, rgba(0,0,0,.46), transparent 20%),
            radial-gradient(circle at 88% 50%, rgba(12,12,12,.50), transparent 16%) !important;
          filter: blur(10px) !important;
          opacity: .72 !important;
          pointer-events: none !important;
        }

        .center-status-title {
          position: relative !important;
          z-index: 1 !important;
          color: #ffffff !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          margin-bottom: 6px !important;
        }

        .center-status-title::after {
          content: ":" !important;
          margin-left: 3px !important;
        }

        .center-status-item {
          position: relative !important;
          z-index: 1 !important;
          background: rgba(255,255,255,0.08) !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
        }

        .center-status-item span {
          color: #ffffff !important;
          font-size: 10px !important;
          line-height: 1.24 !important;
        }

        .center-status-item a,
        .center-status-item button {
          background: linear-gradient(180deg, #d93030 0%, #b61414 100%) !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 999px !important;
          box-shadow:
            0 8px 18px rgba(185, 20, 20, 0.30),
            inset 0 1px 0 rgba(255,255,255,0.22) !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          padding: 6px 11px !important;
          min-height: 28px !important;
          text-transform: none !important;
          letter-spacing: 0 !important;
        }

        .center-status-item a:hover,
        .center-status-item button:hover {
          filter: brightness(1.04) !important;
          transform: translateY(-1px);
        }

        /* safety */
        .center-status-item a::before,
        .center-status-item a::after,
        .center-status-item button::before,
        .center-status-item button::after {
          content: none !important;
        }

        /* GLASS_TOPBLUR_STATUS_FINAL */

        /* -------------------------
           Large glass panel
           More transparent
           ------------------------- */
        .center-expanded-glass {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          box-shadow:
            0 20px 52px rgba(16, 44, 58, 0.12),
            inset 0 1px 0 rgba(255,255,255,0.16) !important;
          backdrop-filter: blur(8px) saturate(112%) !important;
          -webkit-backdrop-filter: blur(8px) saturate(112%) !important;
        }

        .center-expanded-header,
        .portfolio-app-button,
        .center-expanded-placeholder {
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
        }

        /* -------------------------
           Small/top glass panel
           More blurred / rainy glass
           ------------------------- */
        .center-info-glass {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.14)) !important;
          border: 1px solid rgba(255, 255, 255, 0.26) !important;
          box-shadow:
            0 20px 46px rgba(18, 40, 52, 0.18),
            inset 0 1px 0 rgba(255,255,255,0.28) !important;
          backdrop-filter: blur(30px) saturate(135%) !important;
          -webkit-backdrop-filter: blur(30px) saturate(135%) !important;
          position: absolute !important;
          overflow: hidden !important;
        }

        .center-info-glass::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          pointer-events: none !important;
          background:
            radial-gradient(circle at 12% 18%, rgba(255,255,255,.17) 0 1.5px, transparent 2.5px),
            radial-gradient(circle at 26% 38%, rgba(255,255,255,.15) 0 1.6px, transparent 2.8px),
            radial-gradient(circle at 46% 22%, rgba(255,255,255,.14) 0 1.4px, transparent 2.6px),
            radial-gradient(circle at 66% 34%, rgba(255,255,255,.16) 0 1.6px, transparent 2.8px),
            radial-gradient(circle at 78% 20%, rgba(255,255,255,.13) 0 1.2px, transparent 2.4px),
            radial-gradient(circle at 88% 42%, rgba(255,255,255,.15) 0 1.4px, transparent 2.6px) !important;
          opacity: .85 !important;
          z-index: 0 !important;
        }

        .center-info-main,
        .center-info-copy,
        .center-info-title-row,
        .postit-board,
        .center-status-box.postit-status-box {
          position: relative !important;
          z-index: 1 !important;
        }

        /* -------------------------
           Force visible Close X
           red spray paint style
           ------------------------- */
        .center-info-x {
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,0.05) !important;
          color: transparent !important;
          font-size: 0 !important;
          line-height: 1 !important;
          overflow: visible !important;
          box-shadow: none !important;
        }

        .center-info-x::before {
          content: "Ãƒâ€”" !important;
          color: #d01a1a !important;
          font-size: 31px !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          transform: rotate(-7deg) !important;
          text-shadow:
            0 0 1px rgba(95,0,0,.45),
            0 0 8px rgba(208,26,26,.28) !important;
        }

        .center-info-x::after {
          content: "" !important;
          position: absolute !important;
          inset: -4px !important;
          border-radius: 999px !important;
          background:
            radial-gradient(circle at 34% 42%, rgba(214,25,25,.42), transparent 34%),
            radial-gradient(circle at 64% 58%, rgba(176,0,0,.35), transparent 38%),
            radial-gradient(circle at 48% 70%, rgba(255,84,84,.18), transparent 30%) !important;
          filter: blur(7px) !important;
          z-index: -1 !important;
          pointer-events: none !important;
        }

        /* -------------------------
           Status box
           black thick spray effect
           ------------------------- */
        .center-status-box.postit-status-box {
          background: rgba(10, 10, 10, 0.58) !important;
          border: 1px solid rgba(255,255,255,0.14) !important;
          border-radius: 18px !important;
          box-shadow:
            0 12px 28px rgba(0,0,0,0.24),
            inset 0 1px 0 rgba(255,255,255,0.06) !important;
          backdrop-filter: blur(8px) saturate(110%) !important;
          -webkit-backdrop-filter: blur(8px) saturate(110%) !important;
          overflow: hidden !important;
          position: relative !important;
        }

        .center-status-box.postit-status-box::before {
          content: "" !important;
          position: absolute !important;
          left: 10px !important;
          right: 10px !important;
          bottom: 8px !important;
          height: 48px !important;
          border-radius: 999px !important;
          background:
            radial-gradient(circle at 12% 52%, rgba(0,0,0,.62), transparent 18%),
            radial-gradient(circle at 28% 48%, rgba(18,18,18,.72), transparent 24%),
            radial-gradient(circle at 48% 52%, rgba(0,0,0,.66), transparent 22%),
            radial-gradient(circle at 68% 48%, rgba(14,14,14,.74), transparent 24%),
            radial-gradient(circle at 86% 50%, rgba(0,0,0,.58), transparent 18%) !important;
          filter: blur(10px) !important;
          opacity: .88 !important;
          pointer-events: none !important;
        }

        .center-status-title {
          color: #ffffff !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          margin-bottom: 6px !important;
          position: relative !important;
          z-index: 1 !important;
        }

        .center-status-title::after {
          content: ":" !important;
          margin-left: 3px !important;
        }

        .center-status-item {
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          border-radius: 14px !important;
          position: relative !important;
          z-index: 1 !important;
        }

        .center-status-item span {
          color: #ffffff !important;
          font-size: 10px !important;
          line-height: 1.26 !important;
        }

        .center-status-item a,
        .center-status-item button {
          background: linear-gradient(180deg, #dd2a2a 0%, #b91515 100%) !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 999px !important;
          box-shadow:
            0 8px 16px rgba(185, 21, 21, 0.30),
            inset 0 1px 0 rgba(255,255,255,0.18) !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          padding: 6px 11px !important;
          min-height: 28px !important;
          text-transform: none !important;
          letter-spacing: 0 !important;
        }

        .center-status-item a:hover,
        .center-status-item button:hover {
          filter: brightness(1.04) !important;
          transform: translateY(-1px);
        }

        /* ensure text readable */
        .postit-note,
        .postit-note small,
        .postit-note strong {
          text-shadow: none !important;
        }
        @keyframes arrowFlash {
          0%, 100% {
            filter: brightness(1) saturate(1);
            transform: translateY(0);
          }

          42% {
            filter: brightness(1.22) saturate(1.1);
            transform: translateY(-1px);
          }

          58% {
            filter: brightness(1.04) saturate(1);
            transform: translateY(0);
          }
        }

        @keyframes cometSweep {
          0% {
            transform: translate(-80%, -20%) rotate(24deg);
            opacity: 0;
          }

          28% {
            opacity: 0.9;
          }

          68% {
            transform: translate(270%, 30%) rotate(24deg);
            opacity: 0;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes starDrop {
          0% {
            transform: translate(-22px, -14px) scale(0.45);
            opacity: 0;
          }

          28% {
            opacity: 1;
          }

          68% {
            transform: translate(52px, 42px) scale(1.25);
            opacity: 0;
          }

          100% {
            opacity: 0;
          }
        }

        /* MICRO_FINAL_X_STATUS_OVERRIDE */

        .center-info-glass {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.18)) !important;
          backdrop-filter: blur(34px) saturate(145%) !important;
          -webkit-backdrop-filter: blur(34px) saturate(145%) !important;
          border: 1px solid rgba(255,255,255,0.34) !important;
          box-shadow:
            0 22px 48px rgba(15, 42, 55, 0.22),
            inset 0 1px 0 rgba(255,255,255,0.34) !important;
        }

        .center-info-glass::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          z-index: 0 !important;
          pointer-events: none !important;
          background:
            linear-gradient(115deg, rgba(255,255,255,0.10), transparent 34%),
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.22) 0 1.5px, transparent 2.8px),
            radial-gradient(circle at 34% 48%, rgba(255,255,255,0.18) 0 1.5px, transparent 2.8px),
            radial-gradient(circle at 52% 30%, rgba(255,255,255,0.16) 0 1.5px, transparent 2.8px),
            radial-gradient(circle at 71% 42%, rgba(255,255,255,0.20) 0 1.5px, transparent 2.8px),
            radial-gradient(circle at 86% 24%, rgba(255,255,255,0.16) 0 1.5px, transparent 2.8px) !important;
          opacity: .95 !important;
        }

        .center-info-main,
        .center-info-copy,
        .center-info-title-row,
        .postit-board,
        .center-status-box {
          position: relative !important;
          z-index: 1 !important;
        }

        .center-info-x {
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          z-index: 99999 !important;
          width: 46px !important;
          height: 46px !important;
          min-width: 46px !important;
          min-height: 46px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 0 !important;
          outline: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          overflow: visible !important;
          cursor: pointer !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .center-info-x::before,
        .center-info-x::after {
          content: "" !important;
          display: block !important;
          position: absolute !important;
          inset: 1px !important;
          border-radius: 999px !important;
          pointer-events: none !important;
        }

        .center-info-x::before {
          background:
            radial-gradient(circle at 34% 45%, rgba(224, 25, 25, 0.48), transparent 36%),
            radial-gradient(circle at 66% 54%, rgba(174, 0, 0, 0.38), transparent 38%),
            radial-gradient(circle at 48% 76%, rgba(255, 92, 92, 0.22), transparent 32%) !important;
          filter: blur(7px) !important;
          z-index: -1 !important;
        }

        .center-info-x::after {
          inset: 9px !important;
          background:
            linear-gradient(45deg, transparent 41%, rgba(177, 0, 0, .18) 44%, transparent 49%),
            linear-gradient(-45deg, transparent 41%, rgba(177, 0, 0, .16) 44%, transparent 49%) !important;
          filter: blur(1px) !important;
          opacity: .9 !important;
          z-index: 0 !important;
        }

        .spray-x-mark {
          position: relative !important;
          z-index: 2 !important;
          display: block !important;
          color: #d71920 !important;
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 34px !important;
          font-weight: 1000 !important;
          line-height: 1 !important;
          transform: rotate(-7deg) translateY(-1px) !important;
          text-shadow:
            0 0 1px rgba(90,0,0,.65),
            0 0 8px rgba(215,25,32,.36),
            1px 1px 0 rgba(80,0,0,.25) !important;
        }

        .center-status-box.postit-status-box {
          position: relative !important;
          background: rgba(7, 7, 7, 0.66) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          border-radius: 18px !important;
          box-shadow:
            0 14px 32px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.08) !important;
          backdrop-filter: blur(8px) saturate(110%) !important;
          -webkit-backdrop-filter: blur(8px) saturate(110%) !important;
          overflow: hidden !important;
        }

        .center-status-box.postit-status-box::before {
          content: "" !important;
          position: absolute !important;
          left: 8px !important;
          right: 8px !important;
          bottom: 7px !important;
          height: 52px !important;
          border-radius: 999px !important;
          background:
            radial-gradient(circle at 10% 54%, rgba(0,0,0,.78), transparent 20%),
            radial-gradient(circle at 26% 46%, rgba(15,15,15,.86), transparent 25%),
            radial-gradient(circle at 46% 55%, rgba(0,0,0,.82), transparent 24%),
            radial-gradient(circle at 66% 48%, rgba(18,18,18,.84), transparent 26%),
            radial-gradient(circle at 86% 54%, rgba(0,0,0,.76), transparent 20%) !important;
          filter: blur(9px) !important;
          opacity: .96 !important;
          pointer-events: none !important;
          z-index: 0 !important;
        }

        .center-status-title {
          position: relative !important;
          z-index: 2 !important;
          display: block !important;
          color: #ffffff !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          margin-bottom: 6px !important;
          letter-spacing: 0 !important;
        }

        .center-status-title::after {
          content: none !important;
        }

        .center-status-item {
          position: relative !important;
          z-index: 2 !important;
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 14px !important;
        }

        .center-status-item span {
          color: #ffffff !important;
          font-size: 10px !important;
          line-height: 1.25 !important;
          font-weight: 700 !important;
        }

        .center-status-item a,
        .center-status-item button {
          background: linear-gradient(180deg, #e03333 0%, #b91515 100%) !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 999px !important;
          box-shadow:
            0 8px 17px rgba(185,21,21,0.34),
            inset 0 1px 0 rgba(255,255,255,0.20) !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          padding: 6px 12px !important;
          min-height: 28px !important;
          text-decoration: none !important;
          text-transform: none !important;
          letter-spacing: 0 !important;
        }
      `}</style>

      <div className="relative hidden md:block">
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-full w-[4.5rem] -translate-x-1/2 rounded-[1.75rem] bg-slate-100/70" />

        <div className="relative z-10 grid grid-cols-2 gap-8">
          <article className="min-h-[420px] rounded-[2rem] border border-white/90 bg-white/85 px-9 py-9 pr-[7.5rem] shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="mb-3 flex items-center gap-3 text-teal-700">
              <Box size={28} strokeWidth={2.4} />

              <h2 className="font-display whitespace-nowrap text-[clamp(1.45rem,1.9vw,2rem)] font-black leading-none text-teal-700">
                Web based & Apps
              </h2>
            </div>

            <p className="mb-7 truncate whitespace-nowrap text-[clamp(0.78rem,0.95vw,0.95rem)] font-black leading-snug text-slate-900">
              {activeAppsGroup}
            </p>

            <ArrowGrid
              items={digitalProducts}
              offset={appsOffset}
              tone="apps"
              showStack={true}
            />
          </article>

          <article className="min-h-[420px] rounded-[2rem] border border-white/90 bg-white/85 px-9 py-9 pl-[7.5rem] shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="mb-3 flex items-center gap-3 text-orange-600">
              <Wrench size={28} strokeWidth={2.4} />

              <h2 className="font-display whitespace-nowrap text-[clamp(1.18rem,1.55vw,1.7rem)] font-black leading-none text-orange-600">
                Engineering, Automation & AI Tools
              </h2>
            </div>

            <p className="mb-7 truncate whitespace-nowrap text-[clamp(0.78rem,0.95vw,0.95rem)] font-black leading-snug text-slate-900">
              {activeToolsGroup}
            </p>

            <ArrowGrid
              items={engineeringTools}
              offset={toolsOffset}
              tone="tools"
              showStack={true}
            />
          </article>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full bg-white/95 p-2 shadow-[0_18px_36px_rgba(15,23,42,0.16)] ring-1 ring-white">
            <button
              type="button"
              onClick={handleCenterClick}
              className={`pointer-events-auto center-orb-button grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(from_90deg,#14b8a6_0_50%,#f59e0b_50%_100%)] shadow-lg transition duration-200 hover:scale-[1.03] ${isCenterBursting ? "center-orb-bursting" : ""}`}
              aria-label="Click here to see stack detail"
            >
              <span className="grid h-[112px] w-[112px] place-items-center rounded-full bg-white text-center text-[15px] font-black leading-tight text-slate-800 shadow-inner">
                <span>
                  Click
                  <br />
                  Here
                </span>
              </span>
            </button>
          </div>

                                        <div className="absolute left-1/2 top-full mt-4 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-[15px] font-bold text-slate-500 shadow-md backdrop-blur-xl">
            <ArrowRight size={18} className="text-teal-700" />
            <span>{showCenterActions ? "click again to close" : "click here"}</span>
          </div>

          {showCenterActions ? (
            <div
              className={`center-floating-actions pointer-events-none absolute left-1/2 top-1/2 z-40 ${
                selectedCenterAction ? "is-selecting" : ""
              }`}
            >
              {centerActionItems.map((item, index) => {
                const angle = -90 + index * (360 / centerActionItems.length);
                const radius = index % 2 === 0 ? 150 : 185;
                const isSelected = selectedCenterAction === item.label;
                const isMuted = selectedCenterAction && !isSelected;
return (
                  <span
                    key={item.label}
                    className={`center-floating-slot ${
                      isSelected ? "is-selected" : ""
                    } ${isMuted ? "is-muted" : ""}`}
                    style={{
                      "--angle": `${angle}deg`,
                      "--radius": `${radius}px`,
                      "--delay": `${index * 95}ms`
                    } as any}
                  >
                    <button
                      type="button"
                      className="center-floating-glass-action"
                      onClick={(event) => handleCenterActionClick(item.label, event)}
                    >
                      <span className="center-floating-glass-icon">{item.icon}</span>
                      <span className="center-floating-glass-label">{item.label}</span>
                    </button>
                  </span>
                );
              })}
            </div>
          ) : null}

          {centerActionExpanded && selectedCenterAction ? (
            <div className="center-expanded-glass pointer-events-auto" style={expandedGlassStyle}>
              <div className="center-expanded-header">
                <div>
                  <p className="center-expanded-eyebrow">Selected Menu</p>
                  <h3>{selectedCenterAction}</h3>
                </div>

                <button
                  type="button"
                  className="center-expanded-close"
                  onClick={handleCenterPanelClose}
                  aria-label="Close panel"
                >
                  <span>Close</span>
                </button>
              </div>

              <div className="center-expanded-grid">
                {currentCenterItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`center-expanded-placeholder portfolio-app-button ${
                      selectedCenterSubButton === item.id ? "is-active" : ""
                    }`}
                    onClick={(event) => handleCenterSubButtonClick(item.id, event)}
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={optimizedAssetPath(item.logoPath)}
                      alt=""
                      className="portfolio-app-logo"
                      onError={(event) => {
                        event.currentTarget.src = optimizedAssetPath(
                          item.logoPath.includes("/logo-tool/")
                            ? "/assets/logo-tool/tool-missing.png"
                            : "/assets/logo-web/web-missing.png"
                        ) || "";
                      }}
                    />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
              {selectedPortfolioItem ? (
                <div className="center-info-glass" style={infoGlassStyle}>
                  <button
                    type="button"
                    className="center-info-x"
                    onClick={handleCenterInfoClose}
                    aria-label="Close information panel"
                  >
                    <span className="spray-x-mark" aria-hidden="true">Ã—</span>
                  </button>

                  <div className="center-info-main">
                    <div className="center-info-copy">
                      <div className="center-info-title-row">
                        <div>
                          <p className="center-info-eyebrow">Application Detail</p>
                          <h4>{selectedPortfolioItem.name}</h4>
                        </div>

                        <div className="center-info-logo-slot has-logo">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={optimizedAssetPath(selectedPortfolioItem.logoPath)}
                            alt={selectedPortfolioItem.name}
                            onError={(event) => {
                              event.currentTarget.src = optimizedAssetPath(
                                selectedPortfolioItem.logoPath.includes("/logo-tool/")
                                  ? "/assets/logo-tool/tool-missing.png"
                                  : "/assets/logo-web/web-missing.png"
                              ) || "";
                            }}
                          />
                        </div>
                      </div>

                      <div className="postit-board">
                        <div className="postit-note postit-yellow postit-large">
                          <span className="postit-pin" />
                          <small>Nama Aplikasi</small>
                          <strong>{selectedPortfolioItem.name}</strong>
                        </div>

                        <div className="postit-note postit-blue">
                          <span className="postit-pin" />
                          <small>Stack</small>
                          <strong>{selectedPortfolioItem.stack}</strong>
                        </div>

                        <div className="postit-note postit-green">
                          <span className="postit-pin" />
                          <small>Jenis</small>
                          <strong>{selectedPortfolioItem.type}</strong>
                        </div>

                        <div className="postit-note postit-pink">
                          <span className="postit-pin" />
                          <small>Fungsi</small>
                          <strong>{selectedPortfolioItem.functionSummary}</strong>
                        </div>

                        <div className="postit-note postit-orange">
                          <span className="postit-pin" />
                          <small>PO by</small>
                          <strong>{selectedPortfolioItem.poBy}</strong>
                        </div>

                        <div className="postit-note postit-purple">
                          <span className="postit-pin" />
                          <small>Last Owner</small>
                          <strong>{selectedPortfolioItem.lastOwner}</strong>
                        </div>
                      </div>

                      <div className="center-status-box postit-status-box">
                        <span className="center-status-title">Status:</span>

                        <div className="center-status-list">
                          <div className={`center-status-item ${
                            selectedPortfolioItem.ctaUrl ? "is-actionable" : "is-muted"
                          }`}>
                            <span>{getStatusDisplayText(selectedPortfolioItem?.status, selectedPortfolioItem?.statusLabel)}</span>

                            {selectedPortfolioItem.ctaUrl && getStatusButtonText() ? (
                              <a
                                href={selectedPortfolioItem.ctaUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Check it out!
                              </a>
                            ) : (
                              <button type="button" onClick={handleCenterInfoClose}>
                                Close page
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:hidden">
        <article className="rounded-[1.75rem] border border-teal-100 bg-white/85 p-5 shadow-lg shadow-slate-200/70">
          <div className="mb-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-teal-700">
              <Box size={26} strokeWidth={2.4} />

              <h2 className="font-display text-[clamp(1.5rem,7vw,1.9rem)] font-black leading-none text-teal-700">
                Web based & Apps
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setMobileAppsOpen((value) => !value)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-50 px-4 py-3 text-sm font-black text-teal-700 ring-1 ring-teal-100"
            >
              <MousePointerClick size={18} />
              <span>{mobileAppsOpen ? "Hide stack" : "Click here to see stack"}</span>
            </button>
          </div>

          <MobileList items={digitalProducts} open={mobileAppsOpen} tone="apps" />
        </article>

        <article className="rounded-[1.75rem] border border-orange-100 bg-white/85 p-5 shadow-lg shadow-slate-200/70">
          <div className="mb-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-orange-600">
              <Wrench size={26} strokeWidth={2.4} />

              <h2 className="font-display text-[clamp(1.35rem,6vw,1.75rem)] font-black leading-none text-orange-600">
                Engineering, Automation & AI Tools
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setMobileToolsOpen((value) => !value)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-50 px-4 py-3 text-sm font-black text-orange-600 ring-1 ring-orange-100"
            >
              <MousePointerClick size={18} />
              <span>{mobileToolsOpen ? "Hide stack" : "Click here to see stack"}</span>
            </button>
          </div>

          <MobileList items={engineeringTools} open={mobileToolsOpen} tone="tools" />
        </article>
      </div>
    </section>
  );
}

export default ChecklistSections;
