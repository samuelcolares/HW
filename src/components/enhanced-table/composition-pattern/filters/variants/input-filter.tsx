import { Input } from "@/components/ui/input";
import { useTableContext } from "@/components/enhanced-table/table-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface InputFilterProps {
  className?: string;
}

export function InputFilter({ className }: InputFilterProps) {
  const { table } = useTableContext();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      table.setGlobalFilter(search);
    }, 300);
    return () => clearTimeout(id);
  }, [search, table]);

  return (
    <Input
      placeholder="Search"
      className={cn("h-[36px]", "max-w-sm", className)}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
