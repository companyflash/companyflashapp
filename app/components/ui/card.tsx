// components/ui/card.tsx
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}
interface CardContentProps { children: ReactNode; }
interface CardFooterProps { children: ReactNode; }

export function Card({ children }: CardProps) {
  return <div className="bg-white rounded-lg shadow p-4">{children}</div>;
}

export function CardContent({ children }: CardContentProps) {
  return <div className="p-2">{children}</div>;
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="p-2 border-t mt-2">{children}</div>;
}