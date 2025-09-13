import { lazy, Suspense } from "react";

const ExpandCollapse = lazy(() =>
  import("./expand-collapse").then((mod) => ({ default: mod.ExpandCollapse }))
);

const ExportTable = lazy(() =>
  import("./export-pdf").then((mod) => ({ default: mod.ExportTable }))
);

const ViewOptions = lazy(() =>
  import("./view-options").then((mod) => ({ default: mod.ViewOptions }))
);

export const TableToolbar = {
  ExpandCollapse: (props: any) => (
    <Suspense fallback={null}>
      <ExpandCollapse {...props} />
    </Suspense>
  ),
  ExportTable: (props: any) => (
    <Suspense fallback={null}>
      <ExportTable {...props} />
    </Suspense>
  ),
  ViewOptions: (props: any) => (
    <Suspense fallback={null}>
      <ViewOptions {...props} />
    </Suspense>
  ),
};
