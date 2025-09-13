import {
  TableRoot,
  EnhancedTableHeader,
  EnhancedTableBody,
  EnhancedTablePagination,
  EnhancedTableBase,
} from "./enhanced-table";
import { TableFilters } from "./filters";
import { TableToolbar } from "./toolbar";

export const EnhancedTable = {
  Root: TableRoot,
  Toolbar: TableToolbar,
  Filters: TableFilters,
  Header: EnhancedTableHeader,
  Body: EnhancedTableBody,
  Pagination: EnhancedTablePagination,
  Table: EnhancedTableBase,
};

export default EnhancedTable;
