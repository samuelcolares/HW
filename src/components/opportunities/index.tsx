import { CardContent } from "../ui/card";
import EnhancedTable from "../enhanced-table/composition-pattern";
import { columns } from "./columns";
import { OpportunityForm } from "./form";
import { useOpportunities } from "@/providers/opportunities.provider";

export default function Opportunities() {
  const {
    opportunities,
    allOpportunities: optimisticOpportunities,
    loading: isLoading,
  } = useOpportunities();
  return (
    <CardContent className="flex gap-4">
      <div className="flex-1 transition-all duration-300">
        <EnhancedTable.Root
          data={opportunities}
          columns={columns}
          tableName="leads"
          noData={optimisticOpportunities.length === 0}
          emptyComponent={
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <p className="text-xl text-muted-foreground">
                No leads found. Add some leads by clicking the button below to
                get started.
              </p>
              <OpportunityForm />
            </div>
          }
          loading={isLoading}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex gap-2">
              <EnhancedTable.Filters.Input />
              <EnhancedTable.Toolbar.ExportTable />
            </div>
            <div className="flex space-x-2">
              <EnhancedTable.Toolbar.ViewOptions />
              <EnhancedTable.Filters.Sheet />
              <EnhancedTable.Filters.Clear />
            </div>
          </div>
          <div className="rounded-md border">
            <EnhancedTable.Table>
              <EnhancedTable.Header variant={"default"} />
              <EnhancedTable.Body />
            </EnhancedTable.Table>
          </div>
          <EnhancedTable.Pagination />
        </EnhancedTable.Root>
      </div>
    </CardContent>
  );
}
