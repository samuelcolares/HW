import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis, restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, useSortable } from "@dnd-kit/sortable"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react"
import React from "react"
import { TableProvider } from "../table-context"
import { filterRows } from "./filters/utils"
import type { TableRootProps } from "./types"
import { isSpecialId } from "./utils"

export function TableRoot<TData, TValue>({
  data,
  columns,
  enableExpansion,
  enableSelection,
  enableEditing,
  enableColumnReorder,
  enableRowReorder,
  rowReorderKey,
  children,
}: TableRootProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [tableData, setTableData] = React.useState(data)

  React.useEffect(() => {
    setTableData(data)
  }, [data])

  const updateData = (rowIndex: number, updatedData: TData) => {
    setTableData((prevData) => {
      const newData = [...prevData]
      newData[rowIndex] = updatedData
      return newData
    })
  }

  const dataIds = React.useMemo(
    () => tableData.map((data) => (data as any)[rowReorderKey!]),
    [tableData, rowReorderKey],
  )

  const memoColumns = React.useMemo(() => {
    let newColumns = [...columns]

    if (enableSelection && enableExpansion) {
      newColumns = [
        {
          id: "select-expand",
          header: ({ table }) => (
            <div className="flex items-center">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
              />
              <Button variant="ghost" size="sm" onClick={() => table.toggleAllRowsExpanded()}>
                {table.getIsAllRowsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
              {row.getCanExpand() && (
                <Button variant="ghost" size="sm" onClick={() => row.toggleExpanded()}>
                  {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
        } as ColumnDef<TData, unknown>,
        ...newColumns,
      ]
    } else if (enableSelection && !enableExpansion) {
      newColumns = [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        } as ColumnDef<TData, unknown>,
        ...newColumns,
      ]
    } else if (enableExpansion && !enableSelection) {
      newColumns = [
        {
          id: "expand",
          header: ({ table }) => (
            <Button variant="ghost" onClick={() => table.toggleAllRowsExpanded()}>
              {table.getIsAllRowsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ),
          cell: ({ row }) =>
            row.getCanExpand() ? (
              <Button variant="ghost" onClick={() => row.toggleExpanded()}>
                {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : null,
          enableSorting: false,
          enableHiding: false,
        } as ColumnDef<TData, unknown>,
        ...newColumns,
      ]
    }

    if (enableRowReorder) {
      newColumns = [
        ...newColumns,
        {
          id: "reorder",
          header: () => null,
          cell: ({ row, table }) => !table.getIsSomeRowsExpanded() && <RowDragHandleCell rowId={row.id} />,
          enableSorting: false,
          enableHiding: false,
        } as ColumnDef<TData, unknown>,
      ]
    }

    return newColumns
  }, [columns, enableExpansion, enableSelection, enableRowReorder])

  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    memoColumns.map((column) => (enableColumnReorder && column.id && !enableRowReorder ? column.id : "")),
  )

  const table = useReactTable({
    data: tableData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => row.subRows,
    getRowId: (row: any) => (row as any)[rowReorderKey!],
    state: {
      rowSelection,
      sorting,
      columnFilters,
      pagination,
      expanded,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    filterFns: {
      filterRows: filterRows,
    },
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    if (isSpecialId(activeId) || isSpecialId(overId)) return

    if (enableColumnReorder) {
      setColumnOrder((current) => {
        const oldIndex = current.indexOf(activeId)
        const newIndex = current.indexOf(overId)
        return arrayMove(current, oldIndex, newIndex)
      })
    }

    if (enableRowReorder) {
      setTableData((prevData) => {
        const oldIndex = dataIds.indexOf(activeId)
        const newIndex = dataIds.indexOf(overId)
        return arrayMove(prevData, oldIndex, newIndex)
      })
    }
  }

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  if (enableColumnReorder) {
    return (
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <TableProvider
          table={table}
          updateData={updateData}
          columnOrder={columnOrder}
          enableEditing={enableEditing}
          enableColumnReorder={enableColumnReorder}
        >
          <div className="space-y-4">{children}</div>
        </TableProvider>
      </DndContext>
    )
  }

  if (enableRowReorder) {
    return (
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <TableProvider
          table={table}
          updateData={updateData}
          columnOrder={columnOrder}
          enableEditing={enableEditing}
          enableRowReorder={enableRowReorder}
          dataIds={dataIds}
        >
          <div className="space-y-4">{children}</div>
        </TableProvider>
      </DndContext>
    )
  }

  return (
    <TableProvider table={table} updateData={updateData} columnOrder={columnOrder} enableEditing={enableEditing}>
      <div className="space-y-4">{children}</div>
    </TableProvider>
  )
}

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { isDragging, attributes, listeners } = useSortable({
    id: rowId,
  })

  return (
    <Button
      variant="ghost"
      className={cn("p-0", isDragging ? "cursor-grabbing" : "cursor-grab")}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
    </Button>
  )
}
