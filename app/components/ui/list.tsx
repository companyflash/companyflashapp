// components/ui/list.tsx
import { ReactNode } from "react";

interface ListProps { children: ReactNode; }
interface ListItemProps { children: ReactNode; className?: string; }

export function List({ children }: ListProps) {
  return <ul className="space-y-2">{children}</ul>;
}

export function ListItem({ children, className }: ListItemProps) {
  return <li className={className}>{children}</li>;
}