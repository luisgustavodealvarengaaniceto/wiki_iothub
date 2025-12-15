"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg transition">
            IO
          </div>
          <span className="text-xl font-bold hidden sm:inline text-white">
            IoTHub Brasil
          </span>
        </Link>

        {/* Navigation Center */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-slate-200 hover:text-white transition font-medium text-sm"
          >
            Guias Rápidos
          </Link>
          <a
            href="https://docs.jimicloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200 hover:text-white transition font-medium text-sm inline-flex items-center gap-1"
          >
            Doc Oficial
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </nav>

        {/* Right Side: Admin */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition hidden sm:inline-block"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
