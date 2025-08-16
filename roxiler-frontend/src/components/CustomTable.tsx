import { useState } from "react"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react"

type Column<T> = {
  key?: keyof T
  label: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: (row: T) => React.ReactNode 
}

export function CustomTable<T extends { [key: string]: any }>({
  data,
  columns,
  actions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (key?: keyof T) => {
    if (!key) return
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  return (
    <>
      <p className="text-sm p-2 text-muted-foreground italic">
        click on a column header to sort
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                onClick={() => handleSort(col.key)}
                className={col.key ? "cursor-pointer select-none" : ""}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key ? (
                    sortOrder === "asc" ? (
                      <ArrowDownAZ size={14} />
                    ) : (
                      <ArrowUpAZ size={14} />
                    )
                  ) : (
                    ""
                  )}
                </span>
              </TableHead>
            ))}
            {actions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, idx) => (
            <TableRow key={idx} className="hover:bg-muted/50">
              {columns.map((col, colIdx) => (
                <TableCell key={colIdx}>
                  {col.render ? col.render(row) : row[col.key as string]}
                </TableCell>
              ))}
              {actions && <TableCell>{actions(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
