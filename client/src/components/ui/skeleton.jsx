import { cn } from "../../lib/utils";

/* eslint-disable react/prop-types */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-800/50",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
