"use client";

export function Disclaimer() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong className="font-semibold">Guia Simplificado:</strong> Este é um guia de consulta rápida. 
            Para especificações técnicas completas de hardware e firmware, consulte a{" "}
            <a
              href="https://docs.jimicloud.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-700 inline-flex items-center gap-1"
            >
              documentação oficial
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
