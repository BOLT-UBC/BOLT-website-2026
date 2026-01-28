import Link from "next/link";
import { ResourceCard } from "@/components/membership/ResourceCard";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2b1056] via-[#3c1563] to-[#120327] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_0_24px_rgba(255,255,255,0.5)]">Tech Stack Guides</h1>
          <p className="text-white/70 text-lg -mt-1">Beginner-friendly guides with real-world applications</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map((g) => (
              <ResourceCard key={g.title} {...g} />
            ))}
          </div>
            <div className="mt-6 flex items-center justify-between">
            <Link
              href="/membership"
              className="text-white/60 hover:text-white text-sm"
            >
              ← Back to Membership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Each resource and hyperlink
const GUIDES = [
  { title: "Next.js App Router", href: "https://nextjs.org/docs/app",
    desc: "Routing, layouts, server vs client components, data fetching, metadata, deployment." },
  { title: "React Official Docs", href: "https://react.dev/learn",
    desc: "Modern React patterns: state, effects, context, performance, accessibility." },
  { title: "TypeScript for React", href: "https://www.typescriptlang.org/docs/handbook/react.html",
    desc: "Props, generics, unions, discriminated unions, strict mode patterns." },
  { title: "Tailwind CSS", href: "https://tailwindcss.com/docs/utility-first",
    desc: "Utility-first styling, responsive, dark mode, theme extension." },

  { title: "Web Dev: Node + Express", href: "https://expressjs.com/en/starter/hello-world.html",
    desc: "Routing, middleware, error handling, structured APIs." },
  { title: "PostgreSQL Essentials", href: "https://www.postgresql.org/docs/current/tutorial-start.html",
    desc: "SQL basics, indexes, transactions, EXPLAIN, performance." },
  { title: "Supabase Quickstart", href: "https://supabase.com/docs/guides/getting-started/quickstarts/nextjs",
    desc: "Auth, storage, RLS, Next.js integration." },

  { title: "Python Data Stack", href: "https://pandas.pydata.org/docs/getting_started/index.html",
    desc: "DataFrames, IO, groupby, joins, vectorization." },
  { title: "Scikit-learn Essentials", href: "https://scikit-learn.org/stable/tutorial/basic/tutorial.html",
    desc: "Pipelines, model selection, metrics, cross-validation." },

  { title: "Docker: Getting Started", href: "https://docs.docker.com/get-started/",
    desc: "Images, containers, volumes, multi-stage builds for Node/Next." },
  { title: "Git & GitHub Flow", href: "https://docs.github.com/en/get-started/using-git/about-git",
    desc: "Branching, PRs, code reviews, Actions quickstart." },

  { title: "SwiftUI Essentials", href: "https://developer.apple.com/tutorials/swiftui",
    desc: "Views, state, navigation, data flow, previews." },
  { title: "OpenCV (Java/Android)", href: "https://docs.opencv.org/4.x/d9/d52/tutorial_java_dev_intro.html",
    desc: "Core image ops, classifiers, loading models, performance tips." },
];
