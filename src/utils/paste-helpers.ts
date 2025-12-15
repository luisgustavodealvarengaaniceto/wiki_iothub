/**
 * Utilitários para tratar colagem de PDFs no Tiptap
 * Detecta padrões de tabelas e preserva estrutura
 */

interface TableDetectionResult {
  isTable: boolean;
  rows: string[][];
  rawText: string;
}

/**
 * Detecta se o texto colado parece ser uma tabela
 * Procura por padrões: múltiplas linhas com separadores consistentes
 */
export function detectTablePattern(text: string): TableDetectionResult {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length < 2) {
    return { isTable: false, rows: [], rawText: text };
  }

  // Padrão 1: Detecção por Tabs
  const tabSeparated = lines.filter(l => l.includes("\t"));
  if (tabSeparated.length >= lines.length * 0.7) {
    const rows = lines.map(line => 
      line.split("\t").map(cell => cell.trim()).filter(c => c.length > 0)
    );
    
    // Validar se tem colunas consistentes
    const firstRowCols = rows[0]?.length || 0;
    const consistentCols = rows.every(r => r.length === firstRowCols);
    
    if (consistentCols && firstRowCols >= 2) {
      return { 
        isTable: true, 
        rows,
        rawText: text 
      };
    }
  }

  // Padrão 2: Detecção por múltiplos espaços (2+)
  const multiSpaceSeparated = lines.filter(l => /\s{2,}/.test(l));
  if (multiSpaceSeparated.length >= lines.length * 0.7) {
    const rows = lines.map(line => {
      // Quebra por 2+ espaços consecutivos
      return line.split(/\s{2,}/).map(cell => cell.trim()).filter(c => c.length > 0);
    });
    
    const firstRowCols = rows[0]?.length || 0;
    const consistentCols = rows.every(r => r.length === firstRowCols && r.length >= 2);
    
    if (consistentCols && firstRowCols >= 2) {
      return { 
        isTable: true, 
        rows,
        rawText: text 
      };
    }
  }

  // Padrão 3: Detecção por padrão visual (bordas ASCII)
  if (/[┌┬┐├┼┤└┴┘─│]+/.test(text)) {
    return { isTable: true, rows: parseAsciiTable(text), rawText: text };
  }

  return { isTable: false, rows: [], rawText: text };
}

/**
 * Converte texto de tabela detectado em HTML de tabela Tiptap
 */
export function textTableToHtml(rows: string[][]): string {
  if (rows.length === 0) return "";

  let html = '<table><tbody>';
  
  rows.forEach((cells, rowIndex) => {
    html += '<tr>';
    cells.forEach((cell, colIndex) => {
      // Primeira linha como header se tiver padrão de cabeçalho
      const isHeader = rowIndex === 0 && shouldBeHeader(rows, colIndex);
      const tag = isHeader ? 'th' : 'td';
      
      html += `<${tag}>${escapeHtml(cell)}</${tag}>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}

/**
 * Limpa HTML sujo vindo de PDF
 * Remove estilos inline, scripts, mantém estrutura
 */
export function cleanHtmlFromPdf(dirtyHtml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, "text/html");

  // Remove scripts, styles
  doc.querySelectorAll('script, style, meta, link').forEach(el => el.remove());

  // Remove atributos problemáticos, mantém estrutura
  const processElement = (el: Element) => {
    // Remove style, class, id
    el.removeAttribute('style');
    el.removeAttribute('class');
    el.removeAttribute('id');
    el.removeAttribute('data-mce-style');
    el.removeAttribute('data-mce-bogus');
    el.removeAttribute('data-cke-temp');

    // Processa filhos
    Array.from(el.children).forEach(child => processElement(child));
  };

  processElement(doc.body);

  return doc.body.innerHTML;
}

/**
 * Detecta se uma coluna parece ser um cabeçalho
 * (padrão comum: primeira linha com texto curto e em maiúscula)
 */
function shouldBeHeader(rows: string[][], colIndex: number): boolean {
  if (rows.length === 0) return false;
  
  const firstCell = rows[0][colIndex];
  const isShort = firstCell.length < 50;
  const hasManyUppercase = (firstCell.match(/[A-Z]/g) || []).length > firstCell.length * 0.4;
  const isAllCaps = firstCell === firstCell.toUpperCase() && /[A-Z]/.test(firstCell);
  
  return isShort && (hasManyUppercase || isAllCaps);
}

/**
 * Parse tabelas ASCII (linhas com caracteres como ─, │, ┌, etc)
 */
function parseAsciiTable(text: string): string[][] {
  const lines = text.split("\n");
  const rows: string[][] = [];

  for (const line of lines) {
    // Ignora linhas de borda
    if (/^[┌┬┐├┼┤└┴┘─│\s]*$/.test(line)) continue;

    // Quebra por │ (separador vertical)
    const cells = line
      .split("│")
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0 && !/^[─\s]*$/.test(cell));

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return rows;
}

/**
 * Escapa caracteres especiais para HTML seguro
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Detecta linhas numeradas ou com bullet points
 * Útil para converter em listas
 */
export function detectListPattern(text: string): { isList: boolean; items: string[] } {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  
  const bulletPattern = /^[•\-\*\+]\s+/;
  const numberPattern = /^\d+[\.\)]\s+/;
  const letterPattern = /^[a-z][\.\)]\s+/;

  const bulletLines = lines.filter(l => bulletPattern.test(l));
  const numberLines = lines.filter(l => numberPattern.test(l));
  const letterLines = lines.filter(l => letterPattern.test(l));

  const isList = 
    (bulletLines.length >= lines.length * 0.6) ||
    (numberLines.length >= lines.length * 0.6) ||
    (letterLines.length >= lines.length * 0.6);

  if (isList) {
    const items = lines
      .filter(l => bulletPattern.test(l) || numberPattern.test(l) || letterPattern.test(l))
      .map(l => l.replace(/^[•\-\*\+\d+a-z][\.\)]\s+/, ""));
    
    return { isList: true, items };
  }

  return { isList: false, items: [] };
}

/**
 * Converte lista detectada em HTML UL/OL
 */
export function listToHtml(items: string[], isOrdered: boolean = false): string {
  const tag = isOrdered ? "ol" : "ul";
  const itemsHtml = items
    .map(item => `<li>${escapeHtml(item)}</li>`)
    .join("");
  
  return `<${tag}>${itemsHtml}</${tag}>`;
}

/**
 * Processa colagem de PDF de forma inteligente
 * Retorna HTML pronto para inserir no Tiptap
 */
export function processPdfPaste(htmlOrText: string): string {
  let workingText = htmlOrText;

  // Se for HTML sujo, limpa primeiro
  if (htmlOrText.includes("<") && htmlOrText.includes(">")) {
    workingText = cleanHtmlFromPdf(htmlOrText);
    
    // Já tem tabelas? Retorna direto
    if (workingText.includes("<table>")) {
      return workingText;
    }
    
    // Remove tags para tentar detectar padrões em texto
    workingText = workingText.replace(/<[^>]+>/g, " ");
  }

  // Detecta padrão de tabela
  const tableDetection = detectTablePattern(workingText);
  if (tableDetection.isTable) {
    return textTableToHtml(tableDetection.rows);
  }

  // Detecta padrão de lista
  const listDetection = detectListPattern(workingText);
  if (listDetection.isList) {
    return listToHtml(listDetection.items);
  }

  // Fallback: retorna como parágrafos com quebras preservadas
  return workingText
    .split("\n")
    .filter(l => l.trim().length > 0)
    .map(l => `<p>${escapeHtml(l.trim())}</p>`)
    .join("");
}
