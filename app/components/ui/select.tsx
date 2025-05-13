// app/components/ui/select.tsx
"use client";

import * as React from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface SelectProps<T extends string> {
  value: T;
  onValueChange: (val: T) => void;
  children: React.ReactNode;
}

export function Select<T extends string>({ value, onValueChange, children }: SelectProps<T>) {
  return (
    <Listbox value={value} onChange={onValueChange} as={React.Fragment}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <span className="block truncate">{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {children}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  return (
    <Listbox.Option
      key={value}
      value={value}
      className={({ active, selected }) =>
        clsx(
          'cursor-pointer select-none py-2 pl-3 pr-9',
          active ? 'bg-blue-600 text-white' : 'text-gray-900',
          selected ? 'font-semibold' : 'font-normal'
        )
      }
    >
      {({ selected }) => (
        <>
          <span className={clsx('block truncate', selected ? 'font-semibold' : 'font-normal')}>
            {children}
          </span>
        </>
      )}
    </Listbox.Option>
  );
}
