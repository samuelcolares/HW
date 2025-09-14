import { lazy, Suspense } from "react";
import { TableSkeleton } from "@/components/skeletons/table";
import type { TableRootProps } from "./types";
import type { TableHeaderProps } from "./header";
import type { TableBodyProps } from "./body";
import type { TablePaginationProps } from "./pagination";
import type { Row } from "@tanstack/react-table";

const Table = lazy(() =>
  import("@/components/ui/table").then((mod) => ({ default: mod.Table }))
);

const TableBody = lazy(() =>
  import("./body").then((mod) => ({ default: mod.TableBody }))
);

const TableHeader = lazy(() =>
  import("./header").then((mod) => ({ default: mod.TableHeader }))
);

const TablePagination = lazy(() =>
  import("./pagination").then((mod) => ({ default: mod.TablePagination }))
);

const LazyTableRoot = lazy(() =>
  import("./root").then((mod) => ({ default: mod.TableRoot }))
);

export function TableRoot<TData, TValue>(props: TableRootProps<TData, TValue>) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LazyTableRoot {...props} />
    </Suspense>
  );
}

export function EnhancedTableHeader(props: TableHeaderProps) {
  return (
    <Suspense fallback={null}>
      <TableHeader {...props} />
    </Suspense>
  );
}

export function EnhancedTableBody<T>(props: TableBodyProps<T>) {
  const { customRowStyles, onRowClick, ...rest } = props;
  return (
    <Suspense fallback={null}>
      <TableBody
        {...rest}
        onRowClick={onRowClick as ((row: Row<unknown>) => void) | undefined}
        customRowStyles={customRowStyles}
      />
    </Suspense>
  );
}

export function EnhancedTablePagination(props: TablePaginationProps) {
  return (
    <Suspense fallback={null}>
      <TablePagination {...props} />
    </Suspense>
  );
}

export function EnhancedTableBase(
  props: React.HTMLAttributes<HTMLTableElement>
) {
  return (
    <Suspense fallback={null}>
      <Table {...props} />
    </Suspense>
  );
}
