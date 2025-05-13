import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type Variant = "default" | "outline" | "link";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  asChild?: boolean;          // render the child itself (e.g. <Link>)
  className?: string;
}

/**
 * Polymorphic button that can:
 *   • render a real <button>
 *   • OR wrap any other element passed as `children` when `asChild` is true
 *
 * No `any`, no ESLint complaints, and all props (href, target, onClick, …)
 * are forwarded intact.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<Variant, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline:
        "border border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-400",
      link: "text-blue-600 hover:underline bg-transparent",
    };

    // Slot = “render whatever element the parent passed, but apply my props”
    const Comp: React.ElementType = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={clsx(base, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
