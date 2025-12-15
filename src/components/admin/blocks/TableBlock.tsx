"use client";

import { Plus, Trash2 } from "lucide-react";

interface TableBlockData {
  headers: string[];
  rows: string[][];
}

interface TableBlockProps {
  data: TableBlockData;
  isEditing: boolean;
  onChange: (data: TableBlockData) => void;
}

export default function TableBlock({ data, isEditing, onChange }: TableBlockProps) {
  const addColumn = () => {
    onChange({
      headers: [...data.headers, `Nova Coluna ${data.headers.length + 1}`],
      rows: data.rows.map((row) => [...row, ""]),
    });
  };

  const addRow = () => {
    onChange({
      ...data,
      rows: [...data.rows, Array(data.headers.length).fill("")],
    });
  };

  const removeColumn = (colIndex: number) => {
    onChange({
      headers: data.headers.filter((_, i) => i !== colIndex),
      rows: data.rows.map((row) => row.filter((_, i) => i !== colIndex)),
    });
  };

  const removeRow = (rowIndex: number) => {
    onChange({
      ...data,
      rows: data.rows.filter((_, i) => i !== rowIndex),
    });
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...data.headers];
    newHeaders[index] = value;
    onChange({ ...data, headers: newHeaders });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = data.rows.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    );
    onChange({ ...data, rows: newRows });
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-slate-500 uppercase font-medium">📊 Editando Tabela</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addColumn}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition flex items-center gap-1"
            >
              <Plus size={14} /> Coluna
            </button>
            <button
              type="button"
              onClick={addRow}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition flex items-center gap-1"
            >
              <Plus size={14} /> Linha
            </button>
          </div>
        </div>

        {/* Tabela editável */}
        <div className="overflow-x-auto border border-slate-300 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                {data.headers.map((header, colIdx) => (
                  <th key={colIdx} className="border-b border-slate-300 p-2 relative group">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => updateHeader(colIdx, e.target.value)}
                      className="w-full px-2 py-1 border-0 bg-transparent font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                    />
                    {data.headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(colIdx)}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="group hover:bg-slate-50">
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="border-b border-slate-200 p-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className="w-full px-2 py-1 border-0 bg-transparent text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                  ))}
                  <td className="border-b border-slate-200 p-2 w-12">
                    <button
                      type="button"
                      onClick={() => removeRow(rowIdx)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Preview Mode - WYSIWYG
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            {data.headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-slate-900 border-b border-slate-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
              {row.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className="px-4 py-3 text-slate-700 border-b border-slate-200"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
