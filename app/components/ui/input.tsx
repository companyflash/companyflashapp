import { ComponentProps } from "react";
import clsx from "clsx";

export function Input(props: ComponentProps<"input">) {
  const { className, ...rest } = props;
  return (
    <input
      className={clsx(
        "block w-full rounded-md border border-gray-300 px-3 py-2",
        "focus:border-blue-500 focus:ring-blue-500 focus:outline-none",
        "disabled:opacity-50",
        className
      )}
      {...rest}
    />
  );
}
