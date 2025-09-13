import React, { lazy, Suspense } from "react";

const Simple = lazy(() =>
  import("./variants/simple-filter").then((mod) => ({ default: mod.Simple }))
);

const Sheet = lazy(() =>
  import("./variants/sheet-filter").then((mod) => ({ default: mod.Sheet }))
);

const Dialog = lazy(() =>
  import("./variants/dialog-filter").then((mod) => ({ default: mod.Dialog }))
);

const Clear = lazy(() =>
  import("./clear").then((mod) => ({ default: mod.Clear }))
);

export const TableFilters = {
  Simple: (props: any) => (
    <Suspense fallback={null}>
      <Simple {...props} />
    </Suspense>
  ),
  Sheet: (props: any) => (
    <Suspense fallback={null}>
      <Sheet {...props} />
    </Suspense>
  ),
  Dialog: (props: any) => (
    <Suspense fallback={null}>
      <Dialog {...props} />
    </Suspense>
  ),
  Clear: (props: any) => (
    <Suspense fallback={null}>
      <Clear {...props} />
    </Suspense>
  ),
};
