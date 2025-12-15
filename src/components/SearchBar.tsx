"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({
  placeholder = "Busque por erro 301, JC400, FTP...",
  value: externalValue,
  onChange: externalOnChange,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const router = useRouter();

  const value = externalValue ?? internalValue;
  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    externalOnChange?.(newValue);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="
            w-full px-6 py-4 rounded-lg
            bg-white border-2 border-slate-200
            text-slate-900 placeholder-slate-500
            focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100
            transition-all duration-200
            shadow-md hover:shadow-lg
            text-lg
          "
        />
        <button
          type="submit"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            bg-blue-600 text-white px-6 py-2 rounded-md
            hover:bg-blue-700 transition-colors
            font-medium flex items-center gap-2
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Buscar
        </button>
      </div>
    </form>
  );
}
