import { useState, useMemo, useCallback } from "react";

export interface UseDataTableOptions<T> {
  initialData?: T[];
  searchKeys?: (keyof T)[];
  pageSize?: number;
  enableBulkDelete?: boolean;
  enableExport?: boolean;
}

export interface UseDataTableReturn<T> {
  // Data
  data: T[];
  filteredData: T[];
  setData: (data: T[] | ((prev: T[]) => T[])) => void;

  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Bulk operations
  selectedItems: T[];
  selectedIds: string[];
  toggleSelection: (item: T) => void;
  toggleAllSelection: () => void;
  clearSelection: () => void;
  isSelected: (item: T) => boolean;
  isAllSelected: boolean;

  // Filters
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Actions
  handleBulkDelete: () => void;
  handleExport: () => void;
  handleCreate: (item: Partial<T>) => void;
  handleEdit: (item: T) => void;
  handleDelete: (id: string) => void;

  // Computed values
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function useDataTable<T extends { id: string | number }>(
  options: UseDataTableOptions<T> = {}
): UseDataTableReturn<T> {
  const {
    initialData = [],
    searchKeys = [],
    pageSize = 10,
    enableBulkDelete = false,
    enableExport = false,
  } = options;

  // State
  const [data, setData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filtered data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm && searchKeys.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => {
          const itemValue = item[key as keyof T];
          return String(itemValue) === value;
        });
      }
    });

    return filtered;
  }, [data, searchTerm, searchKeys, filters]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSizeState);
  const startIndex = (currentPage - 1) * pageSizeState;
  const endIndex = Math.min(startIndex + pageSizeState, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Selection helpers
  const selectedIds = useMemo(() =>
    selectedItems.map(item => String(item.id)),
    [selectedItems]
  );

  const isSelected = useCallback((item: T) =>
    selectedItems.some(selected => selected.id === item.id),
    [selectedItems]
  );

  const isAllSelected = useMemo(() =>
    paginatedData.length > 0 && paginatedData.every(isSelected),
    [paginatedData, isSelected]
  );

  const toggleSelection = useCallback((item: T) => {
    setSelectedItems(prev => {
      const isCurrentlySelected = prev.some(selected => selected.id === item.id);
      if (isCurrentlySelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const toggleAllSelection = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems(prev =>
        prev.filter(item => !paginatedData.some(pageItem => pageItem.id === item.id))
      );
    } else {
      setSelectedItems(prev => {
        const newSelected = [...prev];
        paginatedData.forEach(item => {
          if (!newSelected.some(selected => selected.id === item.id)) {
            newSelected.push(item);
          }
        });
        return newSelected;
      });
    }
  }, [isAllSelected, paginatedData]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Filter helpers
  const setFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(() =>
    Object.keys(filters).length > 0 || searchTerm.length > 0,
    [filters, searchTerm]
  );

  // Action handlers
  const handleBulkDelete = useCallback(() => {
    if (!enableBulkDelete) return;

    const idsToDelete = selectedIds;
    setData(prev => prev.filter(item => !idsToDelete.includes(String(item.id))));
    clearSelection();
  }, [selectedIds, enableBulkDelete, clearSelection]);

  const handleExport = useCallback(() => {
    if (!enableExport) return;

    // Create CSV content
    const headers = Object.keys(filteredData[0] || {}).filter(key => key !== 'id');
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item =>
        headers.map(header => {
          const value = item[header as keyof T];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : String(value);
        }).join(',')
      )
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [filteredData, enableExport]);

  // CRUD operations
  const handleCreate = useCallback((item: Partial<T>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    } as T;
    setData(prev => [newItem, ...prev]);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setData(prev => prev.map(existing =>
      existing.id === item.id ? item : existing
    ));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setData(prev => prev.filter(item => String(item.id) !== id));
  }, []);

  // Reset page when data changes
  const setDataWithReset = useCallback((newData: T[] | ((prev: T[]) => T[])) => {
    setData(newData);
    setCurrentPage(1);
    clearSelection();
  }, [clearSelection]);

  return {
    // Data
    data,
    filteredData: paginatedData,
    setData: setDataWithReset,

    // Search
    searchTerm,
    setSearchTerm,

    // Pagination
    currentPage,
    pageSize: pageSizeState,
    setCurrentPage,
    setPageSize: setPageSizeState,

    // Bulk operations
    selectedItems,
    selectedIds,
    toggleSelection,
    toggleAllSelection,
    clearSelection,
    isSelected,
    isAllSelected,

    // Filters
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,

    // Actions
    handleBulkDelete,
    handleExport,
    handleCreate,
    handleEdit,
    handleDelete,

    // Computed values
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}