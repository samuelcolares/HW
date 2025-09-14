import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useOptimistic,
  startTransition,
  useCallback,
  useMemo,
} from "react";
import type { Lead } from "@/lib/types/lead.type";
import axios from "axios";
import { useFakePromises } from "@/hooks/use-fake-promises";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { generateLeads } from "@/lib/faker";

type LeadsContextType = {
  leads: Lead[];
  allLeads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  refreshLeads: () => Promise<void>;
  loading: boolean;
  initialLoading: boolean;
  dataCount: number;
  setDataCount: React.Dispatch<React.SetStateAction<number>>;
  headerVariant: "default" | "dropdown";
  setHeaderVariant: React.Dispatch<
    React.SetStateAction<"default" | "dropdown">
  >;
  statusFilter: string[];
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>;
  handleChangeSearchParams: (statusFilters: string[]) => void;
  selectedLead: Lead | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  accountNames: { label: string; value: string }[];
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [headerVariant, setHeaderVariant] = useState<"default" | "dropdown">(
    "default"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [params] = useSearchParams();

  async function fetchData() {
    setIsLoading(true);
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
      setInitialLoading(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!initialLoading) return;
    setInitialLoading(false);

    const loadData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/leads");
        setLeads(data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [initialLoading]);

  useEffect(() => {
    const urlFilters = JSON.parse(params.get(`leads-filters-status`) || "[]");
    setStatusFilter(urlFilters);
  }, [params]);

  useEffect(() => {
    localStorage.setItem(`leads-filters-status`, JSON.stringify(statusFilter));
  }, [statusFilter]);

  const handleChangeSearchParams = useCallback((statusFilters: string[]) => {
    const queryString = new URLSearchParams(window.location.search);

    if (statusFilters.length > 0) {
      queryString.set(`leads-filters-status`, JSON.stringify(statusFilters));
      localStorage.setItem(
        `leads-filters-status`,
        JSON.stringify(statusFilters)
      );
    } else {
      queryString.delete(`leads-filters-status`);
      localStorage.removeItem(`leads-filters-status`);
    }

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${queryString.toString()}`
    );
  }, []);

  const data = useMemo(() => {
    if (statusFilter.length === 0) return optimisticLeads;
    return optimisticLeads.filter((lead) => statusFilter.includes(lead.status));
  }, [optimisticLeads, statusFilter]);

  const accountNames = useMemo(() => {
    return [...new Set(optimisticLeads.map((lead) => lead.company))].map((company) => ({
      label: company,
      value: company,
    }));
  }, [optimisticLeads]);

  return (
    <LeadsContext.Provider
      value={{
        leads: data,
        allLeads: optimisticLeads,
        setLeads,
        refreshLeads: fetchData,
        loading: isLoading,
        initialLoading,
        dataCount,
        setDataCount,
        headerVariant,
        setHeaderVariant,
        statusFilter,
        setStatusFilter,
        handleChangeSearchParams,
        selectedLead,
        setSelectedLead,
        accountNames,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};
