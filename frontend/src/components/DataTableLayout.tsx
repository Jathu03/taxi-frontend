"use client";

import { useState, useMemo, useCallback } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Trash2,
  Filter,
  X,
  Edit2,
  ChevronDown,
  ActivityIcon,
  Columns,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CreateDialog } from "@/components/CreateDialog";

export interface DataTableProps<TData, TValue> {
  // Core data
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  title?: string;

  // Search
  searchKey?: keyof TData;
  searchPlaceholder?: string;

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];

  // Bulk actions
  enableBulkDelete?: boolean;
  onBulkDelete?: (ids: string[]) => void;
  enableBulkChange?: boolean;
  onBulkChange?: (ids: string[], field: keyof TData, value: unknown) => void;
  bulkChangeOptions?: {
    field: keyof TData;
    label: string;
    options: { value: unknown; label: string }[];
  }[];
  idKey?: keyof TData;

  // Export
  enableExport?: boolean;
  onExport?: (data: TData[]) => void;
  exportFileName?: string;

  // Filters
  filters?: {
    key: keyof TData;
    label: string;
    options: { value: string; label: string }[];
  }[];
  enableDynamicFilters?: boolean;
  enableFilters?: boolean; // Show/hide filter dropdown

  // Column visibility
  enableColumnVisibility?: boolean;

  // Custom actions
  customActions?: React.ReactNode;
  // Create dialog
  onCreate?: (newItem: Partial<TData>) => void;
  createDialogFields?: Array<any>;
  createDialogInitialValues?: Partial<TData>;
  createDialogTitle?: string;
  createDialogDescription?: string;

  // Loading state
  isLoading?: boolean;

  // Empty state
  emptyMessage?: string;

  // Hide pagination
  hidePagination?: boolean;

  // Search control
  hideSearch?: boolean;
  externalSearch?: string;
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  pageSizeOptions = [5, 10, 20, 50],
  enableBulkDelete = false,
  onBulkDelete,
  enableBulkChange = false,
  onBulkChange,
  bulkChangeOptions = [],
  idKey = "id" as keyof TData,
  enableExport = false,
  onExport,
  filters = [],
  enableDynamicFilters = false,
  enableColumnVisibility = true,
  customActions,
  isLoading = false,
  emptyMessage = "No data found",
  hidePagination = false,
  enableFilters = true,
  // Create dialog props
  onCreate,
  createDialogFields,
  createDialogInitialValues,
  createDialogTitle = "Create Item",
  createDialogDescription = "Fill in the details to create a new item.",
  hideSearch = false,
  externalSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showBulkChangeMenu, setShowBulkChangeMenu] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Utility function to safely get accessorKey
  const getAccessorKey = useCallback((column: ColumnDef<TData, TValue>): string | null => {
    try {
      // Check if column exists
      if (!column || typeof column !== 'object') return null;

      // Check if column has accessorKey property
      if (!('accessorKey' in column)) return null;

      // Safely access the accessorKey using unknown first (TypeScript recommended approach)
      const columnAsUnknown = column as unknown;
      const columnWithKey = columnAsUnknown as { accessorKey: unknown };
      const accessorKey = columnWithKey.accessorKey;

      // Return only if it's a string
      return typeof accessorKey === 'string' ? accessorKey : null;
    } catch (error) {
      // If any error occurs, return null
      console.warn('Error accessing column accessorKey:', error);
      return null;
    }
  }, []);

  // Generate dynamic filters from data
  const dynamicFilters = useMemo(() => {
    if (!enableDynamicFilters || data.length === 0) return [];

    const filters: { key: keyof TData; label: string; options: { value: string; label: string }[] }[] = [];

    try {
      // Get all unique values for each column
      const columnsToFilter = columns.filter(col => {
        const columnKey = getAccessorKey(col);
        if (!columnKey) return false;

        // Exclude certain columns
        if (columnKey === 'id' || columnKey === 'actions' || columnKey === 'select') return false;

        // Check if the key exists in the data
        const key = columnKey as keyof TData;
        return data.some(item => item && item[key] !== undefined);
      });

      columnsToFilter.forEach(column => {
        const columnKey = getAccessorKey(column);
        if (!columnKey) return;

        const key = columnKey as keyof TData;

        // Get unique values for this column
        const values = [...new Set(
          data
            .map(item => {
              try {
                if (!item || typeof item !== 'object') return null;
                const value = (item as Record<string, unknown>)[String(key)];
                return value !== undefined && value !== null ? String(value) : null;
              } catch (error) {
                console.warn(`Error accessing key ${String(key)} in item:`, error);
                return null;
              }
            })
            .filter(Boolean)
        )];

        // Only create filters for columns with 2-10 unique values
        if (values.length > 1 && values.length <= 10) {
          filters.push({
            key,
            label: typeof column.header === 'string' ? column.header : String(key),
            options: values.filter((value): value is string => value !== null).map(value => ({ value, label: value }))
          });
        }
      });
    } catch (error) {
      console.error('Error generating dynamic filters:', error);
    }



    return filters;
  }, [data, columns, enableDynamicFilters, getAccessorKey]);

  // Combine static and dynamic filters with safety checks
  const allFilters = useMemo(() => {
    try {
      const staticFilters = Array.isArray(filters) ? filters : [];
      const dynamicFiltersArray = Array.isArray(dynamicFilters) ? dynamicFilters : [];
      return [...staticFilters, ...dynamicFiltersArray];
    } catch (error) {
      console.error('Error combining filters:', error);
      return [];
    }
  }, [filters, dynamicFilters]);

  // Add selection column if bulk actions are enabled
  const tableColumns = useMemo(() => {
    if (!enableBulkDelete && !enableBulkChange) return columns;

    const selectionColumn: ColumnDef<TData, TValue> = {
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
    };

    return [selectionColumn, ...columns];
  }, [columns, enableBulkDelete, enableBulkChange]);

  const table = useReactTable({
    data,
    columns: tableColumns,
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
      globalFilter: externalSearch !== undefined ? externalSearch : globalFilter,
    },
  });

  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    if (!onBulkDelete) return;

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(row =>
      String(row.original[idKey])
    );

    onBulkDelete(selectedIds);
    setRowSelection({});
  }, [table, onBulkDelete, idKey]);

  // Handle bulk change
  const handleBulkChange = useCallback((field: keyof TData, value: unknown) => {
    if (!onBulkChange) return;

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(row =>
      String(row.original[idKey])
    );

    onBulkChange(selectedIds, field, value);
    setRowSelection({});
    setShowBulkChangeMenu(false);
  }, [table, onBulkChange, idKey]);

  // Handle export
  const handleExport = useCallback(() => {
    const exportData = table.getFilteredRowModel().rows.map(row => row.original);

    if (onExport) {
      onExport(exportData);
    } else {
      // Default CSV export
      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      // Get column headers
      const headers = table.getAllColumns()
        .filter(col => col.getIsVisible())
        .map(col => {
          const accessorKey = getAccessorKey(col);
          return accessorKey || col.id;
        })
        .filter(Boolean);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => {
            const value = (row as any)[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
          }).join(',')
        )
      ].join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `export_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [table, onExport, getAccessorKey]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }));

    // Find the column by accessorKey
    const column = table.getAllColumns().find(col => {
      const accessorKey = getAccessorKey(col);
      return accessorKey === filterKey;
    });

    if (column) {
      if (value) {
        column.setFilterValue(value);
      } else {
        column.setFilterValue(undefined);
      }
    }
  }, [table, getAccessorKey]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setColumnFilters([]);
    setGlobalFilter("");
  }, []);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasActiveFilters = Object.keys(activeFilters).length > 0 || globalFilter;

  // Add error boundary for the entire component
  try {
    return (
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          {!hideSearch && (
            <div className="flex-1 max-w-sm">
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Create Button */}
            {onCreate && createDialogFields && (
              <>
                <Button onClick={() => setOpenCreateDialog(true)} variant="default">
                  {createDialogTitle}
                </Button>
                <CreateDialog
                  open={openCreateDialog}
                  setOpen={setOpenCreateDialog}
                  title={createDialogTitle}
                  description={createDialogDescription}
                  initialValues={createDialogInitialValues || {}}
                  fields={createDialogFields}
                  onSubmit={onCreate}
                />
              </>
            )}

            {/* Filters */}
            {enableFilters && allFilters && allFilters.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        {Object.keys(activeFilters).length + (globalFilter ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {allFilters.map((filter) => {
                    // Safety check for filter structure
                    if (!filter || typeof filter !== 'object') {
                      console.warn('Invalid filter structure:', filter);
                      return null;
                    }

                    const filterKey = String(filter.key || '');
                    const filterLabel = String(filter.label || '');
                    const filterOptions = Array.isArray(filter.options) ? filter.options : [];

                    return (
                      <div key={filterKey} className="p-2">
                        <label className="text-sm font-medium">{filterLabel}</label>
                        <Select
                          value={activeFilters[filterKey] || "__all__"}
                          onValueChange={(value) => handleFilterChange(filterKey, value === "__all__" ? "" : value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={`Select ${filterLabel}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__all__">All</SelectItem>
                            {filterOptions.map((option) => {
                              if (!option || typeof option !== 'object') {
                                console.warn('Invalid option structure:', option);
                                return null;
                              }
                              const optionValue = String(option.value || '');
                              if (!optionValue) return null;
                              return (
                                <SelectItem key={optionValue} value={optionValue}>
                                  {String(option.label || '')}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                  {hasActiveFilters && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear filters
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {/* Column visibility */}
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Columns className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table.getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Bulk actions */}
            {(enableBulkDelete || enableBulkChange) && selectedRows.length > 0 && (
              <DropdownMenu open={showBulkChangeMenu} onOpenChange={setShowBulkChangeMenu}>
                <DropdownMenuTrigger asChild>
                  <Button variant="default">
                    <ActivityIcon className="h-4 w-4 mr-2" />
                    Bulk Actions ({selectedRows.length})
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {enableBulkDelete && (
                    <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </DropdownMenuItem>
                  )}

                  {enableBulkChange && bulkChangeOptions.length > 0 && (
                    <>
                      {enableBulkDelete && <DropdownMenuSeparator />}
                      {bulkChangeOptions.map((option) => (
                        <DropdownMenu key={String(option.field)}>
                          <DropdownMenuTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Change {option.label}
                            </DropdownMenuItem>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right">
                            {option.options.map((opt) => (
                              <DropdownMenuItem
                                key={String(opt.value)}
                                onClick={() => handleBulkChange(option.field, opt.value)}
                              >
                                {opt.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Export */}
            {enableExport && (
              <Button
                variant="outline"

                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}

            {/* Custom actions */}
            {customActions}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === 'string'
                          ? <span className="font-bold text-black">{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Only show if not hidden */}
        {!hidePagination && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {pageSizeOptions.map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering EnhancedDataTable:', error);
    return (
      <div className="space-y-4 p-4 border border-red-200 bg-red-50 rounded-md">
        <h3 className="text-red-800 font-medium">Error Loading Table</h3>
        <p className="text-red-600 text-sm">
          There was an error loading the data table. Please try refreshing the page.
        </p>
        <details className="text-xs text-red-500">
          <summary>Error Details</summary>
          <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
      </div>
    );
  }
}