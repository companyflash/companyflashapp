// components/ui/table.tsx
import { ReactNode } from "react";

interface TableBaseProps { children: ReactNode; className?: string; }

export function Table({ children }: TableBaseProps) {
  return <table className="w-full table-auto border-collapse">{children}</table>;
}
export function TableHeader({ children }: TableBaseProps) {
  return <thead className="bg-gray-100">{children}</thead>;
}
export function TableBody({ children }: TableBaseProps) {
  return <tbody>{children}</tbody>;
}
export function TableRow({ children }: TableBaseProps) {
  return <tr className="border-b">{children}</tr>;
}
export function TableHead({ children }: TableBaseProps) {
  return <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">{children}</th>;
}
export function TableCell({ children }: TableBaseProps) {
  return <td className="px-4 py-2 text-sm text-gray-800">{children}</td>;
}