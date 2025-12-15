"use client";

import { useState } from "react";

interface TableData {
  columns: string[];
  rows: string[][];
}

interface ManualTableBlockProps {
  data: TableData;
  onChange: (data: TableData) => void;
  onRemove: () => void;
}

/**
 * Bloco de Tabela Manual - Editor linha por linha
 * Admin define colunas e adiciona linhas com inputs de texto
 */
export function ManualTableBlock({ data, onChange, onRemove }: ManualTableBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempColumns, setTempColumns] = useState<string[]>(data.columns || []);
  const [tempRows, setTempRows] = useState<string[][]>(data.rows || []);
  const [newColumnName, setNewColumnName] = useState("");

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      setTempColumns([...tempColumns, newColumnName.trim()]);
      setNewColumnName("");
      // Adicionar célula vazia em todas as linhas
      setTempRows(tempRows.map(row => [...row, ""]));
    }
  };

  const handleRemoveColumn = (index: number) => {
    const newColumns = tempColumns.filter((_, i) => i !== index);
    const newRows = tempRows.map(row => row.filter((_, i) => i !== index));
    setTempColumns(newColumns);
    setTempRows(newRows);
  };

  const handleAddRow = () => {
    setTempRows([...tempRows, Array(tempColumns.length).fill("")]);
  };

  const handleRemoveRow = (index: number) => {
    setTempRows(tempRows.filter((_, i) => i !== index));
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tempRows];
    newRows[rowIndex][colIndex] = value;
    setTempRows(newRows);
  };

  const handleColumnNameChange = (index: number, newName: string) => {
    const newColumns = [...tempColumns];
    newColumns[index] = newName;
    setTempColumns(newColumns);
  };

  const handleSave = () => {
    onChange({
      columns: tempColumns,
      rows: tempRows,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-3">
          <h4 className="font-semibold text-slate-900 mb-4">Editor de Tabela</h4>

          {/* Colunas */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-slate-900 mb-2">Colunas</h5>
            <div className="space-y-2 mb-3">
              {tempColumns.map((col, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={col}
                    onChange={(e) => handleColumnNameChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                    placeholder="Nome da coluna"
                  />
                  <button
                    onClick={() => handleRemoveColumn(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="Nova coluna"
              />
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium"
              >
                + Coluna
              </button>
            </div>
          </div>

          {/* Aviso se não há colunas */}
          {tempColumns.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm text-yellow-800">
              ⚠️ Adicione pelo menos uma coluna antes de adicionar linhas
            </div>
          )}
        </div>

        {/* Grid de dados */}
        {tempColumns.length > 0 && (
          <div className="p-4">
            <h5 className="text-sm font-semibold text-slate-900 mb-3">Linhas</h5>

            {/* Tabela de edição */}
            <div className="mb-4 border border-slate-300 rounded overflow-auto max-h-96">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-3 py-2 text-left font-medium text-slate-900 w-12">
                      #
                    </th>
                    {tempColumns.map((col, i) => (
                      <th
                        key={i}
                        className="border border-slate-300 px-3 py-2 text-left font-medium text-slate-900"
                      >
                        {col}
                      </th>
                    ))}
                    <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-900 w-12">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tempRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50">
                      <td className="border border-slate-300 px-3 py-2 text-slate-500 text-center">
                        {rowIndex + 1}
                      </td>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border border-slate-300 p-0">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className="w-full px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="-"
                          />
                        </td>
                      ))}
                      <td className="border border-slate-300 px-3 py-2 text-center">
                        <button
                          onClick={() => handleRemoveRow(rowIndex)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleAddRow}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 font-medium"
            >
              + Adicionar Linha
            </button>
          </div>
        )}

        {/* Botões de ação */}
        <div className="bg-slate-50 border-t border-slate-300 px-4 py-3 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            ✅ Salvar
          </button>
          <button
            onClick={() => {
              setTempColumns(data.columns || []);
              setTempRows(data.rows || []);
              setIsEditing(false);
            }}
            className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-medium"
          >
            ❌ Cancelar
          </button>
          <button
            onClick={onRemove}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium ml-auto"
          >
            🗑️ Remover
          </button>
        </div>
      </div>
    );
  }

  // Preview Mode - Tabela renderizada
  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      <div className="bg-slate-50 border-b border-slate-300 px-4 py-2 flex justify-between items-center">
        <span className="text-sm text-slate-600">
          Tabela ({tempRows.length} {tempRows.length === 1 ? "linha" : "linhas"})
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ✏️ Editar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              {tempColumns.map((col, i) => (
                <th
                  key={i}
                  className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900 bg-slate-100"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tempRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-slate-300 px-4 py-3 text-slate-700"
                  >
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
