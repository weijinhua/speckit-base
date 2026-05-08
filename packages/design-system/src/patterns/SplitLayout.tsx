import * as React from "react";
import { cn } from "../utils/cn";

export interface SplitLayoutProps {
  direction?: "horizontal" | "vertical";
  ratio?: [number, number];
  first: React.ReactNode;
  second: React.ReactNode;
}

export function SplitLayout({
  direction = "horizontal",
  ratio = [1, 1],
  first,
  second
}: SplitLayoutProps) {
  const [firstRatio, secondRatio] = ratio;
  const columnsClass =
    direction === "horizontal"
      ? firstRatio > secondRatio
        ? "lg:grid-cols-[2fr_1fr]"
        : firstRatio < secondRatio
          ? "lg:grid-cols-[1fr_2fr]"
          : "lg:grid-cols-2"
      : "grid-cols-1";

  return (
    <div
      className={cn("grid gap-4", columnsClass)}
    >
      <section className="min-w-0">{first}</section>
      <section className="min-w-0">{second}</section>
    </div>
  );
}
