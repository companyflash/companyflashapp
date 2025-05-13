import { ReactNode } from "react";
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

/* ─────────────────────────────────────────────
   Column type — single definition, exported
   ───────────────────────────────────────────── */
export interface Column<T, K extends keyof T = keyof T> {
  header: string;
  accessor: K;
  render?: (value: T[K], row?: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
}

export default function Table<T>({
  columns,
  data,
  title,
}: TableProps<T>) {
  return (
    <div className="bg-white p-4 rounded shadow">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}

      <UiTable>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.accessor)}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, ri) => (
            <TableRow key={ri}>
              {columns.map((col) => {
                const value = row[col.accessor];      // value is T[K]
                return (
                  <TableCell key={String(col.accessor)}>
                    {col.render ? col.render(value, row) : (value as ReactNode)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </UiTable>
    </div>
  );
}
