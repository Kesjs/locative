import React from "react";

export interface ColumnDef<T> {
  key: string;
  header: string;
  renderCell: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = "Aucune donnée." }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-[13px] text-[#64635F] italic border border-[#E8E5E0] rounded-[8px] bg-[#FAF9F6]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile View: Cards (< 768px) */}
      <div className="block md:hidden space-y-4">
        {data.map((row) => (
          <div key={keyExtractor(row)} className="bg-white border border-[#E8E5E0] rounded-[8px] shadow-xs p-4 flex flex-col gap-3">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-center gap-4">
                <span className="text-[11px] text-[#9C9A95] font-medium uppercase tracking-wider shrink-0">
                  {col.header}
                </span>
                <div className="text-[13px] font-semibold text-[#1C1C1C] text-right break-words overflow-hidden">
                  {col.renderCell(row)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop View: Table (>= 768px) */}
      <div className="hidden md:block overflow-x-auto bg-white border border-[#E8E5E0] rounded-[8px] shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#FAF9F6] border-b border-[#E8E5E0] sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-[11px] font-bold text-[#64635F] uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5E0]">
            {data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-[#FAF9F6]/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[13px] text-[#1C1C1C]">
                    {col.renderCell(row)}
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
