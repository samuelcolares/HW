"use client";

import { EnhancedTable } from "@/components/enhanced-table/composition-pattern";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Row } from "@tanstack/react-table";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { TableSkeleton } from "@/components/skeletons/table";
import { type Person, columns } from "./columns";
import { generateLeads } from "@/lib/faker";
import { useFakePromises } from "@/hooks/use-fake-promises";
import { toast } from "sonner";
import axios from "axios";
import { z } from "zod";

const Lead = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  email: z.string(),
  source: z.string(),
  score: z.number(),
  status: z.string(),
});

type Lead = z.infer<typeof Lead> & {
  createdAt: Date;
  updatedAt: Date;
};

export function Leads() {
  const { randomPromise } = useFakePromises();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [optimisticLeads] = useOptimistic<
    Lead[],
    Partial<Lead> & { id: string }
  >(leads, (currentLeads, updatedLead) => {
    return currentLeads.map((lead) =>
      lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
    );
  });

  const [dataCount, setDataCount] = useState<number>(100);
  const [headerVariant, setHeaderVariant] = useState<"default" | "dropdown">(
    "default"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchData() {
    setIsLoading(false);
    const saving = toast.loading("Saving data...");
    try {
      // Generate new data
      const newData = generateLeads(dataCount);

      // Optimistically update the UI immediately
      startTransition(() => {
        setLeads(newData);
      });

      // Try the risky operation
      await randomPromise();

      // If randomPromise succeeds, proceed with API operations
      const { data: existing } = await axios.get("http://localhost:5000/leads");

      if (Array.isArray(existing) && existing.length) {
        await Promise.all(
          existing.map((row: Lead) =>
            axios.delete(`http://localhost:5000/leads/${row.id}`)
          )
        );
      }

      // Insert new leads
      await Promise.all(
        newData.map((row) => axios.post("http://localhost:5000/leads", row))
      );

      setInitialLoading(false);
      toast.dismiss(saving);
      toast.success("Data saved successfully!");
    } catch (error: unknown) {
      startTransition(() => {
        setLeads(leads);
      });
      toast.dismiss(saving);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save data - reverted to previous state"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!initialLoading) return;
    setInitialLoading(false);

    const loadData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/leads");
        setLeads(data); // Use regular state for initial load
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [initialLoading]);

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center justify-end space-x-2">
        <Input
          type="number"
          value={dataCount}
          onChange={(e) => setDataCount(Number(e.target.value))}
          className="w-32"
        />

        <Button onClick={fetchData} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Leads Table</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable.Root
              data={optimisticLeads}
              columns={columns}
              // enableExpansion
              // enableSelection
              // enableEditing
              // enableColumnReorder
            >
              <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-4">
                <div className="flex flex-wrap gap-2">
                  <EnhancedTable.Toolbar.ViewOptions />
                  <EnhancedTable.Toolbar.ExpandCollapse />
                  <Select
                    value={headerVariant}
                    onValueChange={(value: "default" | "dropdown") =>
                      setHeaderVariant(value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select header style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Header</SelectItem>
                      <SelectItem value="dropdown">Dropdown Header</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <EnhancedTable.Toolbar.ExportTable />
                  <EnhancedTable.Filters.Dialog />
                  <EnhancedTable.Filters.Sheet />
                  <EnhancedTable.Filters.Clear />
                </div>
              </div>
              <div className="rounded-md border">
                <EnhancedTable.Table>
                  <EnhancedTable.Header variant={headerVariant} />
                  <EnhancedTable.Body customRowStyles={customRowStyles} />
                </EnhancedTable.Table>
              </div>
              <EnhancedTable.Pagination />
            </EnhancedTable.Root>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const customRowStyles = (row: Row<Person>) => {
  const baseStyles = "transition-colors hover:bg-opacity-20";
  const statusStyles = {
    active: "hover:bg-green-100 dark:hover:bg-green-900/50",
    inactive: "hover:bg-red-100 dark:hover:bg-red-900/50",
    pending: "hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
  };

  return `${baseStyles} ${statusStyles[row.original.status]}`;
};
