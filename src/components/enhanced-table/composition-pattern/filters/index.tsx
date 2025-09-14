import  { lazy, Suspense } from "react";
import type { InputFilterProps } from "./variants/input-filter";

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

const Input = lazy(() =>
  import("./variants/input-filter").then((mod) => ({
    default: mod.InputFilter,
  }))
);

export const TableFilters = {
  Simple: () => (
    <Suspense fallback={null}>
      <Simple />
    </Suspense>
  ),
  Sheet: () => (
    <Suspense fallback={null}>
      <Sheet />
    </Suspense>
  ),
  Dialog: () => (
    <Suspense fallback={null}>
      <Dialog />
    </Suspense>
  ),
  Clear: () => (
    <Suspense fallback={null}>
      <Clear />
    </Suspense>
  ),
  Input: (props: InputFilterProps) => (
    <Suspense fallback={null}>
      <Input {...props} />
    </Suspense>
  ),
};
