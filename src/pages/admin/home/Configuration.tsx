"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditDialog } from "@/components/EditDialog";
import { useDataTable } from "@/hooks/useDataTable";

export type Configuration = {
  id: string;
  name: string;
  value: string;
  discription: string;
};

const createDialogFields = [
  {
    name: "name" as keyof Configuration,
    label: "Param Name",
    type: "text" as const,
  },
  {
    name: "value" as keyof Configuration,
    label: "Param Value",
    type: "text" as const,
  },

  {
    name: "discription" as keyof Configuration,
    label: "Description",
    type: "textarea" as const,
  },
];



const columns = (
  onDelete: (id: string) => void,
  onEdit: (updated: Configuration) => void
): ColumnDef<Configuration>[] => [
  { accessorKey: "name", header: "Param Name" },
  { accessorKey: "value", header: "Param Value" },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const configuration = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditDialog
            initialValues={configuration}
            onSubmit={onEdit}
            title={`Edit ${configuration.name}`}
            fields={createDialogFields}
            trigger={
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            }
          />
          <DeleteDialog
            title={`Delete ${configuration.name}?`}
            description="This action cannot be undone."
            onConfirm={() => onDelete(configuration.id)}
            trigger={
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-red-600 hover:text-red-600">
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            }
          />
        </div>
      );
    },
  },
];

const mockConfiguration: Configuration[] = [
  {
    id: "1",
    name: "Project Kickoff",
    value: "John Doe",
    discription: "Discuss project goals and milestones.",
  },
];

export default function Configuration() {
  const { data, setData } = useDataTable<Configuration>({
    initialData: mockConfiguration,
    searchKeys: ["name", "value"],
    pageSize: 10,
    enableBulkDelete: true,
    enableExport: true,
  });

  const handleDelete = (id: string) => {
    setData(data.filter((d: any) => d.id !== id));
  };

  const handleEdit = (updated: Configuration) => {
    setData(data.map((d: any) => (d.id === updated.id ? updated : d)));
  };

  const handleCreate = (values: Partial<Configuration>) => {
    const newAppointment: Configuration = {
      id: (data.length + 1).toString(),
      name: values.name ?? "",
      value: values.value ?? "",

      discription: values.discription ?? "",
    };
    setData([...data, newAppointment]);
  };

  const handleBulkChange = (
    ids: string[],
    field: keyof Configuration,
    value: any
  ) => {
    setData(
      data.map((d: any) => (ids.includes(d.id) ? { ...d, [field]: value } : d))
    );
  };

  const bulkChangeOptions = [
    {
      field: "status" as keyof Configuration,
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#6330B8]">Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Manage system configurations and parameters
        </p>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, handleEdit)}
        data={data}
        enableFilters={false}
        enableBulkChange={true}
        onBulkChange={handleBulkChange}
        bulkChangeOptions={bulkChangeOptions}
        enableBulkDelete={true}
        onBulkDelete={(ids) =>
          setData(data.filter((d: any) => !ids.includes(d.id)))
        }
        onCreate={handleCreate}
        createDialogFields={createDialogFields}
        createDialogInitialValues={{
          id: "",
          name: "",
          value: "",
      
          discription: "",
          
        }}
        createDialogTitle="Add Configuration"
        createDialogDescription="Fill in the details to add a new configuration."
        enableExport={false}
        isLoading={false}
        emptyMessage="No Configuration found. Add one to get started."
        hidePagination={true}
      />
    </div>
  );
}
