
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Building, DollarSign, Hash, TrendingUp, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { Opportunity } from "@/lib/types/opportunity.type";
import { scorerParser } from "@/lib/score-parser";

export const columns: ColumnDef<Opportunity>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: () => (
      <span className="flex items-center gap-2">
        <Hash />
        ID
      </span>
    ),
    meta: { export: { pdf: { header: "Name" } } },
    filterFn: "filterRows",
  },
  {
    id: "name",
    accessorKey: "name",
    header: () => (
      <span className="flex items-center gap-2">
        <User />
        Name
      </span>
    ),
    meta: { export: { pdf: { header: "Name" } } },
    filterFn: "filterRows",
  },

  {
    id: "stage",
    accessorKey: "stage",
    header: () => (
      <span className="flex items-center gap-2">
        <TrendingUp />
        Stage
      </span>
    ),
    meta: { export: { pdf: { header: "Stage" } } },
    filterFn: "filterRows",
  },

  {
    id: "amount",
    accessorKey: "amount",
    header: () => (
      <span className="flex items-center gap-2">
        <DollarSign />
        Amount
      </span>
    ),
    cell: ({ row }) => {
      const { bg, tooltip } = scorerParser(row.getValue("amount"));
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <div className={cn(bg, "w-4 h-4 rounded-full")} />
              {row.getValue("amount")}
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      );
    },
    filterFn: "filterRows",
    meta: { export: { pdf: { header: "Amount" } } },
  },

  {
    id: "accountName",
    accessorKey: "accountName",
    header: () => (
      <span className="flex items-center gap-2">
        <Building />
        Account Name
      </span>
    ),

    meta: { export: { pdf: { header: "Account Name" } } },
    filterFn: "filterRows",
  },
];
