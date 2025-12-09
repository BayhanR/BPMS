"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableDayProps {
  date: Date;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DroppableDay({ date, children, className, onClick }: DroppableDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `date-${date.toISOString()}`,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        className,
        isOver && "ring-2 ring-primary/50 bg-primary/10"
      )}
    >
      {children}
    </div>
  );
}

