"use client";

import type { Table } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import * as React from "react";
import type { ColumnFilter, FilterType } from "../types";
import { getColumnFilterTypesByValue } from "../utils";
import { useTableContext } from "@/components/enhanced-table/table-context";

interface UseDialogsProps<TData> {
  table: Table<TData>;
}

export function useDialogs<TData>({ table }: UseDialogsProps<TData>) {
  const { tableName } = useTableContext();
  const [filters, setFilters] = React.useState<ColumnFilter[]>(() => {
    const savedFilters = localStorage.getItem(`${tableName}-filters`);
    return savedFilters ? JSON.parse(savedFilters) : [];
  });

  const [params] = useSearchParams();

  const handleChangeSearchParams = React.useCallback(
    (filters: ColumnFilter[]) => {
      const queryString = new URLSearchParams(window.location.search);

      if (filters.length > 0) {
        queryString.set(`${tableName}-filters`, JSON.stringify(filters));
        localStorage.setItem(`${tableName}-filters`, JSON.stringify(filters));
      } else {
        queryString.delete(`${tableName}-filters`);
        localStorage.removeItem(`${tableName}-filters`);
      }

      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${queryString.toString()}`
      );
    },
    [tableName]
  );

  const applyFilters = React.useCallback(() => {
    handleChangeSearchParams(filters);
  }, [filters, handleChangeSearchParams]);

  const resetFilters = React.useCallback(() => {
    table.resetColumnFilters();
    setFilters([]);
    handleChangeSearchParams([]);
  }, [table, handleChangeSearchParams]);

  const updateFilterValue = React.useCallback(
    (columnId: string, value: unknown) => {
      setFilters((prev) => {
        const existingFilter = prev.find((f) => f.id === columnId);
        if (existingFilter)
          return prev.map((f) => (f.id === columnId ? { ...f, value } : f));

        const sampleValue = table
          .getPrePaginationRowModel()
          .rows?.[0]?.getValue(columnId);
        const availableFilterTypes = getColumnFilterTypesByValue(sampleValue);
        const defaultType = availableFilterTypes[0];

        return [...prev, { id: columnId, type: defaultType, value }];
      });
    },
    [table]
  );

  const updateFilterType = React.useCallback(
    (columnId: string, type: FilterType) => {
      setFilters((prev) => {
        const existingFilter = prev.find((f) => f.id === columnId);
        if (existingFilter) {
          return prev.map((f) =>
            f.id === columnId ? { ...f, type, value: "" } : f
          );
        }

        return [...prev, { id: columnId, type, value: "" }];
      });
    },
    []
  );

  const getCurrentFilter = React.useCallback(
    (columnId: string, defaultType: FilterType) => {
      const foundFilter = filters.find((f) => f.id === columnId);
      if (foundFilter) return foundFilter;
      return { id: columnId, value: "", type: defaultType };
    },
    [filters]
  );

  React.useEffect(() => {
    const urlFilters = JSON.parse(params.get(`${tableName}-filters`) || "[]");
    setFilters(urlFilters);
  }, [params, tableName]);

  React.useEffect(() => {
    for (const filter of filters) {
      const column = table.getColumn(filter.id);
      if (column) {
        column.setFilterValue({ value: filter.value, type: filter.type });
      }
    }
    localStorage.setItem(`${tableName}-filters`, JSON.stringify(filters));
  }, [filters, table, tableName]);

  return {
    filters,
    setFilters,
    applyFilters,
    resetFilters,
    updateFilterValue,
    updateFilterType,
    getCurrentFilter,
  };
}
