import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { AtSign, Building, TrendingUp, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { Lead } from "@/lib/types/lead.type";
import { scorerParser } from "@/lib/score-parser";

export const columns: ColumnDef<Lead>[] = [
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
    id: "company",
    accessorKey: "company",
    header: () => (
      <span className="flex items-center gap-2">
        <Building />
        Company
      </span>
    ),

    meta: { export: { pdf: { header: "Company" } } },
    filterFn: "filterRows",
  },
  {
    id: "email",
    accessorKey: "email",
    header: () => (
      <span className="flex items-center gap-2">
        <AtSign />
        Email
      </span>
    ),
    meta: { export: { pdf: { header: "Email" } } },
    filterFn: "filterRows",
  },

  {
    id: "score",
    accessorKey: "score",
    header: () => (
      <span className="flex items-center gap-2">
        <TrendingUp />
        Score
      </span>
    ),
    cell: ({ row }) => {
      const { bg, tooltip } = scorerParser(row.getValue("score"));
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <div className={cn(bg, "w-4 h-4 rounded-full")} />
              {row.getValue("score")}
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      );
    },
    filterFn: "filterRows",
    meta: { export: { pdf: { header: "Progress" } } },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status")} className="capitalize">
        {row.getValue("status")}
      </Badge>
    ),
    filterFn: "filterRows",
    meta: { export: { pdf: { header: "Status" } } },
  },

  // {
  //   id: "createdAt",
  //   accessorKey: "createdAt",
  //   header: () => (
  //     <span className="flex items-center gap-2">
  //       <Calendar />
  //       Created At
  //     </span>
  //   ),
  //   accessorFn: (row) => format(new Date(row.createdAt), "MM/dd/yyyy"),
  //   cell: ({ row }) => (
  //     <span className="text-sm text-gray-500">{row.getValue("createdAt")}</span>
  //   ),
  //   filterFn: "filterRows",
  //   meta: { export: { pdf: { header: "Created At" } } },
  // },
];
