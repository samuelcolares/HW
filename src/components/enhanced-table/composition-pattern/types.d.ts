interface TableRootBaseProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  children: React.ReactNode
  enableSelection?: boolean
  enableExpansion?: boolean
  enableEditing?: boolean
}

interface TableRootWithColumnReorderProps<TData, TValue> extends TableRootBaseProps<TData, TValue> {
  enableColumnReorder: true
  enableRowReorder?: false
  rowReorderKey?: never
}

interface TableRootWithRowReorderProps<TData, TValue> extends TableRootBaseProps<TData, TValue> {
  enableRowReorder: true
  rowReorderKey: string
  enableColumnReorder?: false
}

interface TableRootWithoutReorderProps<TData, TValue> extends TableRootBaseProps<TData, TValue> {
  enableColumnReorder?: false
  enableRowReorder?: false
  rowReorderKey?: never
}

export type TableRootProps<TData, TValue> =
  | TableRootWithColumnReorderProps<TData, TValue>
  | TableRootWithRowReorderProps<TData, TValue>
  | TableRootWithoutReorderProps<TData, TValue>
