"use client";

import { EnhancedTable } from "@/components/enhanced-table/composition-pattern";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TableSkeleton } from "@/components/skeletons/table";
import { columns } from "./columns";

import { MultiSelect } from "../ui/multi-select";
import { useLeads } from "@/providers/leads.provider";
import type { Lead } from "@/lib/types/lead.type";
import { LeadSidebar } from "./sidebar";
import { AnimatePresence } from "framer-motion";
import SmoothTab from "../ui/smooth-tabs";
import { useState } from "react";
import { OpportunityForm } from "../opportunities/form";
import Opportunities from "../opportunities";

export function Leads() {
  const [view, setView] = useState<"leads" | "opportunities">("leads");
  const {
    initialLoading,
    loading: isLoading,
    leads,
    allLeads: optimisticLeads,
    headerVariant,
    setHeaderVariant,
    statusFilter,
    setStatusFilter,
    handleChangeSearchParams,
    selectedLead,
    setSelectedLead,
  } = useLeads();

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center">
        <OpportunityForm setView={setView} />
        <AddLeads setView={setView} />
      </div>

      {initialLoading && <TableSkeleton />}

      {!initialLoading && (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="sr-only">
              {view === "leads" ? "Leads Table" : "Opportunities Table"}
            </CardTitle>
            <SmoothTab
              value={view}
              onChange={(tabId) => setView(tabId as "leads" | "opportunities")}
              items={[
                {
                  id: "leads",
                  title: "Leads",
                  color: "bg-[#1F9CFE] hover:bg-[#1F9CFE]/80",
                },
                {
                  id: "opportunities",
                  title: "Opportunities",
                  color: "bg-emerald-500 hover:bg-emerald-600",
                },
              ]}
              defaultTabId="leads"
            />
          </CardHeader>
          {view === "leads" && (
            <CardContent className="flex gap-4">
              <div className="flex-1 transition-all duration-300">
                <EnhancedTable.Root
                  data={leads}
                  columns={columns}
                  tableName="leads"
                  noData={optimisticLeads.length === 0}
                  emptyComponent={
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <p className="text-xl text-muted-foreground">
                        No leads found. Add some leads by clicking the button
                        below to get started.
                      </p>
                      <AddLeads />
                    </div>
                  }
                  loading={optimisticLeads.length === 0 && isLoading}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex gap-2">
                      <EnhancedTable.Filters.Input />
                      <EnhancedTable.Toolbar.ExportTable />
                    </div>
                    <div className="flex space-x-2">
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
                          <SelectItem value="default">Toggle Header</SelectItem>
                          <SelectItem value="dropdown">
                            Dropdown Header
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <MultiSelect
                        defaultValue={statusFilter}
                        options={bundleStatus(optimisticLeads).map(
                          (status) => ({
                            label: status,
                            value: status,
                          })
                        )}
                        onValueChange={(value) => {
                          setStatusFilter(value);
                          handleChangeSearchParams(value);
                        }}
                        placeholder="Filter by status"
                        className="max-w-xs !min-h-9 !h-9 border-gray-400"
                      />
                      <EnhancedTable.Toolbar.ViewOptions />
                      <EnhancedTable.Filters.Sheet />
                      <EnhancedTable.Filters.Clear />
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <EnhancedTable.Table>
                      <EnhancedTable.Header variant={headerVariant} />
                      <EnhancedTable.Body
                        onRowClick={(data) => {
                          const lead = data.original as unknown as Lead;
                          if (lead.id === selectedLead?.id) {
                            return setSelectedLead(null);
                          }
                          return setSelectedLead(lead);
                        }}
                        selectedId={selectedLead?.id}
                      />
                    </EnhancedTable.Table>
                  </div>
                  <EnhancedTable.Pagination />
                </EnhancedTable.Root>
              </div>
              <AnimatePresence>
                {selectedLead && <LeadSidebar lead={selectedLead} />}
              </AnimatePresence>
            </CardContent>
          )}
          {view === "opportunities" && <Opportunities />}
        </Card>
      )}
    </div>
  );
}

const bundleStatus = (leads: Lead[]) => {
  const set = new Set(leads.map((lead) => lead.status));
  return Array.from(set);
};

function AddLeads({
  setView,
}: {
  setView?: React.Dispatch<React.SetStateAction<"leads" | "opportunities">>;
}) {
  const {
    allLeads,
    dataCount,
    setDataCount,
    refreshLeads,
    loading: isLoading,
  } = useLeads();
  return (
    <div className="flex items-center justify-end space-x-2">
      <Input
        type="number"
        value={dataCount}
        onChange={(e) => setDataCount(Number(e.target.value))}
        className="w-32"
      />

      <Button
        onClick={() => {
          refreshLeads();
          setView?.("leads");
        }}
        disabled={isLoading}
        loading={isLoading}
        loadingText={allLeads.length === 0 ? "Generating Leads" : "Refreshing Leads"}
      >
        {allLeads.length === 0 ? "Generate Leads" : "Refresh Leads"}
      </Button>
    </div>
  );
}
