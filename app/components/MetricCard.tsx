// components/MetricCard.tsx
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface MetricCardProps {
  title: string;
  value: number | string;
  actionLabel?: string;
  href?: string;
}

export default function MetricCard({
  title,
  value,
  actionLabel,
  href,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </CardContent>

      {actionLabel && href && (
        <CardFooter>
          <Button asChild variant="link">
            <a href={href}>{actionLabel}</a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
