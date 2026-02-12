import { useState, useEffect, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface InitialFilter {
  id: string;
  value: string[];
}

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  enableColumnVisibility?: boolean;
  filters?: FilterConfig[];
  pageSize?: number;
  onFilterChange?: (filters: { key: string; values: string[] }[]) => void;
  initialFilters?: InitialFilter[];
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  searchKey = "name",
  searchPlaceholder = "Search...",
  enableColumnVisibility = false,
  filters = [],
  pageSize = 10,
  onFilterChange,
  initialFilters = [],
}: EnhancedDataTableProps<TData, TValue>) {
  // State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    initialFilters.map((f) => ({ id: f.id, value: f.value }))
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  // Get current filter values for a column
  const getFilterValue = (columnId: string): string[] => {
    const filter = columnFilters.find((f) => f.id === columnId);
    if (!filter) return [];
    if (Array.isArray(filter.value)) {
      return filter.value as string[];
    }
    return [filter.value as string];
  };

  // Notify parent of filter changes - called directly in handler, not in useEffect
  const notifyFilterChange = useCallback(
    (newFilters: ColumnFiltersState) => {
      if (onFilterChange) {
        const filterData = newFilters.map((filter) => ({
          key: filter.id,
          values: Array.isArray(filter.value)
            ? (filter.value as string[])
            : [filter.value as string],
        }));
        onFilterChange(filterData);
      }
    },
    [onFilterChange]
  );

  // Handle checkbox filter change
  const handleFilterChange = (
    columnId: string,
    value: string,
    checked: boolean
  ) => {
    setColumnFilters((prev) => {
      const currentFilter = prev.find((f) => f.id === columnId);
      const currentValues: string[] = currentFilter
        ? Array.isArray(currentFilter.value)
          ? (currentFilter.value as string[])
          : [currentFilter.value as string]
        : [];

      let newValues: string[];

      if (checked) {
        if (!currentValues.includes(value)) {
          newValues = [...currentValues, value];
        } else {
          newValues = currentValues;
        }
      } else {
        newValues = currentValues.filter((v) => v !== value);
      }

      let newFilters: ColumnFiltersState;

      if (newValues.length === 0) {
        newFilters = prev.filter((f) => f.id !== columnId);
      } else {
        const exists = prev.some((f) => f.id === columnId);
        if (exists) {
          newFilters = prev.map((f) =>
            f.id === columnId ? { ...f, value: newValues } : f
          );
        } else {
          newFilters = [...prev, { id: columnId, value: newValues }];
        }
      }

      // Notify parent after state calculation
      setTimeout(() => notifyFilterChange(newFilters), 0);

      return newFilters;
    });
  };

  // Clear filter for a specific column
  const clearFilter = (columnId: string) => {
    setColumnFilters((prev) => {
      const newFilters = prev.filter((f) => f.id !== columnId);
      setTimeout(() => notifyFilterChange(newFilters), 0);
      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    setTimeout(() => notifyFilterChange([]), 0);
  };

  // Check if any filters are active
  const hasActiveFilters = columnFilters.length > 0 || globalFilter !== "";

  // Get total active filter count
  const totalActiveFilters = columnFilters.reduce((acc, filter) => {
    const values = Array.isArray(filter.value) ? filter.value : [filter.value];
    return acc + values.length;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Dropdowns */}
          {filters.map((filter) => {
            const selectedValues = getFilterValue(filter.key);
            const hasSelection = selectedValues.length > 0;

            return (
              <DropdownMenu key={filter.key}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9",
                      hasSelection && "border-primary bg-primary/5"
                    )}
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {filter.label}
                    {hasSelection && (
                      <Badge
                        variant="secondary"
                        className="ml-2 px-1.5 py-0 text-xs"
                      >
                        {selectedValues.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Filter by {filter.label}
                  </div>
                  <DropdownMenuSeparator />
                  {filter.options.map((option) => {
                    const isChecked = selectedValues.includes(option.value);
                    return (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          handleFilterChange(filter.key, option.value, checked);
                        }}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                  {hasSelection && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-muted-foreground hover:text-foreground"
                          onClick={() => clearFilter(filter.key)}
                        >
                          <X className="mr-2 h-3 w-3" />
                          Clear {filter.label}
                        </Button>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 text-muted-foreground hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Clear all ({totalActiveFilters})
            </Button>
          )}

          {/* Column Visibility Toggle */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Columns
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {columnFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {columnFilters.map((filter) => {
            const filterConfig = filters.find((f) => f.key === filter.id);
            const values = Array.isArray(filter.value)
              ? filter.value
              : [filter.value];

            return values.map((value) => {
              const option = filterConfig?.options.find(
                (o) => o.value === value
              );
              return (
                <Badge
                  key={`${filter.id}-${value}`}
                  variant="secondary"
                  className="gap-1 pr-1 hover:bg-secondary/80"
                >
                  <span className="text-muted-foreground">
                    {filterConfig?.label}:
                  </span>
                  <span>{option?.label || value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent hover:text-destructive"
                    onClick={() =>
                      handleFilterChange(filter.id, value as string, false)
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            });
          })}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} of {data.length}{" "}
        results
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-muted/50">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Search className="h-8 w-8" />
                    <span>No results found.</span>
                    {hasActiveFilters && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={clearAllFilters}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}