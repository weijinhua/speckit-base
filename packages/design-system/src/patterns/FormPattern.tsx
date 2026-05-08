import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/Card";
import { cn } from "../utils/cn";

export interface FormPatternProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function FormPattern({
  title,
  description,
  children,
  actions,
  className
}: FormPatternProps) {
  return (
    <Card className={cn("max-w-2xl", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {actions ? <CardFooter className="justify-end gap-3">{actions}</CardFooter> : null}
    </Card>
  );
}
