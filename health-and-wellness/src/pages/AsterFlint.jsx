import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  CreditCard,
  LineChart,
  ShieldCheck,
  Users,
  Globe2,
  Sparkles,
  Rocket,
  ArrowRight,
} from "lucide-react";

// Tailwind palette suggestion (light bg, modern blue primary):
// primary: #2563eb (tailwind blue-600), accents via indigo/cyan

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

const logos = [
  { name: "AWS", src: "", label: "AWS" },
  { name: "PostgreSQL", src: "", label: "PostgreSQL" },
  { name: "Next.js", src: "", label: "Next.js" },
  { name: "React", src: "", label: "React" },
  { name: "Vite", src: "", label: "Vite" },
  { name: "Tailwind", src: "", label: "Tailwind" },
  { name: "Stripe", src: "", label: "Stripe" },
  { name: "SendGrid", src: "", label: "SendGrid" },
  { name: "Postmark", src: "", label: "Postmark" },
  { name: "Zapier", src: "", label: "Zapier" },
];

function LogoTicker() {
  return (
    <div className="relative overflow-hidden py-6">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent" />
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-[ticker_30s_linear_infinite] gap-10 whitespace-nowrap will-change-transform">
          {[...logos, ...logos].map((l, i) => (
            <div
              key={i}
              className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="h-8 w-8 rounded-md bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center text-xs text-gray-700">
                {l.label[0]}
              </div>
              <span className="text-sm text-gray-600">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

const features = [
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Appointments & Scheduling",
    desc: "Book, reschedule, and automate reminders with calendar sync.",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Payments Built‑In",
    desc: "Collect one‑off or recurring payments with invoices and receipts.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Integrated CRM",
    desc: "Leads, contacts, tags, pipelines, email + SMS in one place.",
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    title: "Dashboards & Reports",
    desc: "Real‑time KPIs, funnels, cohorts, exports — all ready on day one.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Enterprise‑Grade Security",
    desc: "SSO‑ready auth, RBAC, audit logs, encryption in transit & at rest.",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Blazing Performance",
    desc: "Next.js + Edge CDN + optimized assets for instant loads globally.",
  },
];

const freebies = [
  {
    title: "Free Website Template",
    desc: "Beautiful, responsive, SEO‑ready site included with every plan.",
  },
  { title: "CRM", desc: "Contacts, tags, pipelines, notes, files." },
  { title: "Email Campaigns", desc: "Broadcasts, drip sequences, templates." },
  { title: "Team Messaging", desc: "Slack‑style channels & DMs (lite)." },
  { title: "Dashboard", desc: "Unified metrics across all your tools." },
  { title: "Analytics", desc: "At‑a‑glance insights and exports." },
];

const industries = [
  "Realtors & Property Managers",
  "Therapists & Private Clinics",
  "HR & Recruitment Teams",
  "Event & Wedding Planners",
  "E‑Learning & Coaches",
  "Gyms & Fitness Studios",
  "Car Dealerships & Rentals",
  "Musicians & Creators",
  "Legal Professionals",
  "SMBs & Agencies",
];

const testimonials = [
  {
    quote:
      "Vestro streamlined our bookings and client follow‑ups — we grew 40% in a quarter.",
    name: "Dr. Jane Alvarez",
    role: "Psychologist",
  },
  {
    quote:
      "Listings + CRM + automated emails in one place. We close deals faster.",
    name: "Michael Santos",
    role: "Real Estate Broker",
  },
  {
    quote:
      "From ticketing to sponsor reports — our events finally have a single source of truth.",
    name: "Avery Kim",
    role: "Event Director",
  },
];

export default function VestroLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-blue-600 text-white grid place-items-center font-bold">
              V
            </div>
            <span className="font-semibold tracking-tight">Aster Flint</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#products" className="hover:text-gray-900">
              Products
            </a>
            <a href="#features" className="hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="hover:text-gray-900">
              Pricing
            </a>
            <a href="#about" className="hover:text-gray-900">
              About
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
              Sign in
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl font-semibold tracking-tight md:text-5xl"
            >
              One Platform. Infinite Solutions.
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mt-4 max-w-xl text-lg text-gray-600"
            >
              Industry‑tailored SaaS to run your business — appointments,
              listings, courses, events, HR and more — plus a free website, CRM
              and analytics.
            </motion.p>
            <motion.div variants={fadeIn} className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white shadow-sm hover:bg-blue-700">
                Get Started for $500/mo <Rocket className="h-4 w-4" />
              </button>
              <button className="rounded-xl border border-gray-200 px-5 py-3 hover:bg-gray-50">
                Explore Products
              </button>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="mt-6 flex items-center gap-3 text-sm text-gray-500"
            >
              <CheckCircle2 className="h-4 w-4 text-green-600" /> No credit card
              required
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <div className="text-sm font-medium text-blue-800">
                    Bookings
                  </div>
                  <div className="mt-2 h-24 rounded-lg bg-white/70"></div>
                </div>
                <div className="rounded-xl bg-indigo-50 p-4">
                  <div className="text-sm font-medium text-indigo-800">
                    Listings
                  </div>
                  <div className="mt-2 h-24 rounded-lg bg-white/70"></div>
                </div>
                <div className="rounded-xl bg-cyan-50 p-4">
                  <div className="text-sm font-medium text-cyan-800">CRM</div>
                  <div className="mt-2 h-24 rounded-lg bg-white/70"></div>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <div className="text-sm font-medium text-emerald-800">
                    Analytics
                  </div>
                  <div className="mt-2 h-24 rounded-lg bg-white/70"></div>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg">
                Super‑fast • Modern • Secure
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGO TICKER */}
      <section aria-label="Technology partners">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-medium text-gray-500">
            Powered by industry‑leading technology
          </p>
          <LogoTicker />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeIn}
              className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Everything You Need, Out of the Box
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="mx-auto mt-3 max-w-2xl text-center text-gray-600"
            >
              Launch in days with battle‑tested modules that scale with you.
            </motion.p>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FREEBIES */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeIn}
              className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Bonuses Included With Every Plan
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="mx-auto mt-3 max-w-2xl text-center text-gray-600"
            >
              Get more than software — launch with a website, CRM, messaging and
              analytics.
            </motion.p>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {freebies.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="inline-flex h-8 items-center rounded-full bg-emerald-50 px-3 text-xs font-medium text-emerald-700">
                    <Sparkles className="mr-2 h-4 w-4" /> Freebie
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Perfect For Your Business
          </motion.h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Choose an industry suite or mix‑and‑match to create your perfect
            toolkit.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {industries.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm hover:border-blue-300 hover:shadow-md"
              >
                <div className="mx-auto h-10 w-10 rounded-xl bg-blue-50" />
                <div className="mt-3 text-sm font-medium text-gray-800">
                  {name}
                </div>
                <button className="mt-2 inline-flex items-center gap-1 text-xs text-blue-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
            Launch in Days, Not Months
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              "Choose Your Plan",
              "We Customize & Deploy",
              "Grow & Automate",
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                  {i + 1}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {i === 0 &&
                    "Select your industry suite and add the modules you need."}
                  {i === 1 &&
                    "We configure your site, CRM, and workflows. Go live fast."}
                  {i === 2 &&
                    "Automate busywork and track growth from a single dashboard."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
            Simple, Scalable Pricing
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Start at $500/mo for the first 6 months. Grow into $1200+ as you
            scale. Enterprise from $3000/mo.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$500/mo",
                desc: "Launch fast with essentials",
                items: [
                  "Free website template",
                  "CRM + email campaigns",
                  "Dashboard & reports",
                  "Basic support",
                ],
                cta: "Start Starter",
              },
              {
                name: "Growth",
                price: "$1200/mo",
                desc: "Scale with automation",
                items: [
                  "Advanced automations",
                  "Team messaging (lite)",
                  "Integrations & webhooks",
                  "Priority support",
                ],
                cta: "Upgrade to Growth",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom (from $3000/mo)",
                desc: "Tailored, white‑glove setup",
                items: [
                  "Custom modules",
                  "SSO & RBAC",
                  "SLAs & onboarding",
                  "Dedicated manager",
                ],
                cta: "Talk to Sales",
              },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`relative rounded-2xl border ${
                  p.highlighted
                    ? "border-blue-300 shadow-lg"
                    : "border-gray-200 shadow-sm"
                } bg-white p-6`}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold">{p.price}</div>
                <p className="mt-1 text-sm text-gray-600">{p.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />{" "}
                      {it}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-6 w-full rounded-xl px-4 py-2 text-sm font-medium ${
                    p.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {p.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
            Loved by Modern Teams
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <blockquote className="text-gray-800">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-gray-600">
                  — {t.name}, {t.role}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-10 text-white shadow-lg">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Your Business. Powered by Vestro.
            </h2>
            <p className="mt-2 max-w-2xl text-white/90">
              Start today and unlock your free CRM, website and dashboards — no
              credit card required.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50">
                Start Free Trial
              </button>
              <button className="rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="border-t border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-blue-600 text-white grid place-items-center font-bold">
                V
              </div>
              <span className="font-semibold tracking-tight">Vestro</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              We build industry‑tailored SaaS that helps businesses launch
              faster and grow smarter.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a href="#products" className="hover:text-gray-900">
                  Suites
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-gray-900">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a href="#about" className="hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Vestro, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
