/**
 * CSS para normalizar HTML convertido de PDF
 * Remove estilos de "leitor de PDF" e mantém apenas o conteúdo
 */
export const PDF_CLEANER_CSS = `
  /* Remove fundos e cores de fundo */
  html, body, #page-container, .page-container {
    background-color: transparent !important;
    background-image: none !important;
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  /* Esconde sidebar/navegação do PDF */
  #sidebar, .sidebar, nav[id*="nav"], .navigation {
    display: none !important;
  }

  /* Remove aparência de "folha de papel" */
  .pf, .page, [class*="page"], [id*="page"] {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 20px !important;
    border: none !important;
    background-color: transparent !important;
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    page-break-after: auto !important;
    page-break-before: auto !important;
  }

  /* Remove posicionamento absoluto que quebra o layout */
  div[style*="position: absolute"], 
  span[style*="position: absolute"],
  p[style*="position: absolute"] {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
  }

  /* Ajusta texto para legibilidade */
  .t, span, p, div {
    color: #334155 !important; /* slate-700 */
  }

  /* Garante que imagens sejam responsivas */
  img {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
  }

  /* Normaliza tabelas */
  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }

  td, th {
    padding: 8px !important;
    border: 1px solid #d1d5db !important;
  }

  /* Remove estilos inline que podem quebrar layout */
  *[style*="width: 8"] {
    width: 100% !important;
  }

  *[style*="width: 9"] {
    width: 100% !important;
  }

  /* Garante fluxo de texto normal */
  .pc {
    position: relative !important;
    width: 100% !important;
  }
`;
