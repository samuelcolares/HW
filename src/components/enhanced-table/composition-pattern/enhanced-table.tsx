import { lazy, Suspense } from "react";
import { TableSkeleton } from "@/components/skeletons/table";

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

export function TableRoot(props: any) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LazyTableRoot {...props} />
    </Suspense>
  );
}

export function EnhancedTableHeader(props: any) {
  return (
    <Suspense fallback={null}>
      <TableHeader {...props} />
    </Suspense>
  );
}

export function EnhancedTableBody(props: any) {
  return (
    <Suspense fallback={null}>
      <TableBody {...props} />
    </Suspense>
  );
}

export function EnhancedTablePagination(props: any) {
  return (
    <Suspense fallback={null}>
      <TablePagination {...props} />
    </Suspense>
  );
}

export function EnhancedTableBase(props: any) {
  return (
    <Suspense fallback={null}>
      <Table {...props} />
    </Suspense>
  );
}
