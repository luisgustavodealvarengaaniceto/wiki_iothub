"use client";

import Link from "next/link";

interface CardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  color?: "blue" | "indigo" | "slate";
}

export function Card({
  icon,
  title,
  description,
  href,
  color = "blue",
}: CardProps) {
  const colorClasses = {
    blue: "hover:border-blue-500 hover:shadow-lg",
    indigo: "hover:border-indigo-500 hover:shadow-lg",
    slate: "hover:border-slate-400 hover:shadow-lg",
  };

  return (
    <Link href={href}>
      <div
        className={`
          bg-white border border-slate-200 rounded-lg p-8 text-slate-900
          transition-all duration-300 cursor-pointer
          hover:scale-105 ${colorClasses[color]}
          shadow-sm hover:shadow-md
        `}
      >
        {/* Ícone */}
        <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group">
          {icon.startsWith('mdi-') ? (
            <i className={`mdi ${icon} text-blue-600`} style={{ fontSize: 32 }} />
          ) : (
            <span className="text-4xl">{icon}</span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>

        {/* Descrição */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* CTA Link */}
        <div className="flex items-center text-blue-600 font-medium text-sm hover:text-blue-700 transition">
          Acessar
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
