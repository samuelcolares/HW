import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useOptimistic,
  useMemo,
} from "react";
import type { Opportunity } from "@/lib/types/opportunity.type";
import axios from "axios";

type OpportunitiesContextType = {
  opportunities: Opportunity[];
  allOpportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  loading: boolean;
  initialLoading: boolean;
};

const OpportunitiesContext = createContext<
  OpportunitiesContextType | undefined
>(undefined);

export const OpportunitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [optimisticOpportunities] = useOptimistic<
    Opportunity[],
    Partial<Opportunity> & { id: string }
  >(opportunities, (currentOpportunities, updatedOpportunity) => {
    return currentOpportunities.map((opportunity) =>
      opportunity.id === updatedOpportunity.id
        ? { ...opportunity, ...updatedOpportunity }
        : opportunity
    );
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!initialLoading) return;
    setInitialLoading(false);

    const loadData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/opportunities");
        setOpportunities(data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [initialLoading]);

  const data = useMemo(() => {
    return optimisticOpportunities;
  }, [optimisticOpportunities]);

  return (
    <OpportunitiesContext.Provider
      value={{
        opportunities: data,
        allOpportunities: optimisticOpportunities,
        setOpportunities,
        loading: isLoading,
        initialLoading,
      }}
    >
      {children}
    </OpportunitiesContext.Provider>
  );
};

export const useOpportunities = () => {
  const context = useContext(OpportunitiesContext);
  if (!context) {
    throw new Error(
      "useOpportunities must be used within a OpportunityProvider"
    );
  }
  return context;
};
