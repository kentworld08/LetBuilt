"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
          Error 404
        </p>

        <h1 className="mt-4 text-6xl font-bold tracking-tight">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
          >
            <Home size={18} />
            Go to website
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}
