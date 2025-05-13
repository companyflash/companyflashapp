"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
} from "react";

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={clsx(
      "inline-flex items-center justify-center rounded-md bg-gray-100 p-1",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={clsx(
      "px-3 py-1.5 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:shadow rounded-sm transition-colors focus:outline-none",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={clsx("mt-4 focus:outline-none", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
