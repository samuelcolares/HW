"use client";

import type { Table } from "@tanstack/react-table";
import type React from "react";
import { createContext, useContext } from "react";

interface TableContextProps {
  table: Table<any>;
  updateData: (rowIndex: number, updatedData: any) => void;
  enableEditing?: boolean;
  enableColumnReorder?: boolean;
  enableRowReorder?: boolean;
  dataIds?: any[];
  columnOrder?: string[];
  enableRowSelection?: boolean;
  loading: boolean;
  noData: boolean;
  emptyComponent?: React.ReactNode;
  tableName: string;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

export const TableProvider: React.FC<
  TableContextProps & { children: React.ReactNode }
> = ({
  table,
  updateData,
  enableEditing,
  enableColumnReorder,
  enableRowReorder,
  enableRowSelection,
  dataIds,
  columnOrder,
  children,
  loading,
  noData,
  emptyComponent,
  tableName,
}) => {
  return (
    <TableContext.Provider
      value={{
        table,
        updateData,
        enableEditing,
        enableColumnReorder,
        enableRowReorder,
        enableRowSelection,
        dataIds,
        columnOrder,
        loading,
        noData,
        emptyComponent,
        tableName,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
