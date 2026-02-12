"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Field<T> {
  name: keyof T;
  label: string;
  placeholder?: string;
  type: "text" | "select" | "checkbox" | "input" | "textarea"| "number" | "date";
  options?: string[];
  validate?: (value: any) => string | null;
}

interface EditDialogProps<T> {
  title: string;
  description?: string;
  initialValues: T;
  onSubmit: (values: T) => void;
  fields: Field<T>[];
  trigger: React.ReactNode; 
}

export function EditDialog<T>({
  title,
  description,
  initialValues,
  onSubmit,
  fields,
  trigger,
}: EditDialogProps<T>) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Reset values when dialog opens (optional)
  React.useEffect(() => {
    if (open) setValues(initialValues);
  }, [open, initialValues]);

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = () => {
    let valid = true;
    const newErrors: Record<string, string | null> = {};
    fields.forEach(({ name, validate }) => {
      if (validate) {
        const error = validate(values[name]);
        newErrors[name as string] = error;
        if (error) valid = false;
      }
    });
    setErrors(newErrors);
    if (!valid) return;

    onSubmit(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px] h-fit overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-4">
          {fields.map(({ name, label, placeholder, type, options }) => (
            <div key={name as string} className="grid gap-1">
            <Label htmlFor={name as string}>{label}</Label>
          
            {(type === "text" || type === "input") && (
              <>
                <Input
                  id={name as string}
                  value={values[name] as any}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(name, e.target.value)}
                />
                {errors[name as string] && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircleIcon className="w-4 h-4" />
                    <p>{errors[name as string]}</p>
                  </div>
                )}
              </>
            )}
          
            {type === "number" && (
              <>
                <Input
                  id={name as string}
                  type="number"
                  value={values[name] as any}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(name, Number(e.target.value))}
                />
                {errors[name as string] && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircleIcon className="w-4 h-4" />
                    <p>{errors[name as string]}</p>
                  </div>
                )}
              </>
            )}
          
            {type === "textarea" && (
              <>
                <textarea
                  id={name as string}
                  value={values[name] as any}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(name, e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm resize-none"
                  rows={4}
                />
                {errors[name as string] && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircleIcon className="w-4 h-4" />
                    <p>{errors[name as string]}</p>
                  </div>
                )}
              </>
            )}
          
            {type === "select" && options && (
              <Select
                value={values[name] as string}
                onValueChange={(val) => handleChange(name, val)}
              >
                <SelectTrigger id={name as string}>
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          
            {type === "checkbox" && (
              <Checkbox
                id={name as string}
                checked={!!values[name]}
                onCheckedChange={(checked) => handleChange(name, checked)}
                className="h-4 w-4 mt-2"
              />
            )}
            {type === "date" && (
              <>
                <Input 
                  id={name as string}
                  type="date"
                  value={(() => {
                    const val = values[name];
                    if (val instanceof Date) {
                      return val.toISOString().split('T')[0];
                    }
                    if (typeof val === 'string') {
                      // Try to parse the date string
                      try {
                        const parsed = new Date(val);
                        if (!isNaN(parsed.getTime())) {
                          return parsed.toISOString().split('T')[0];
                        }
                      } catch {
                        // If parsing fails, return empty
                      }
                      // If it's already in YYYY-MM-DD format, use it
                      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                        return val;
                      }
                    }
                    return '';
                  })()}
                  onChange={(e) => handleChange(name, e.target.value)}
                  className="w-full"
                />
                {errors[name as string] && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircleIcon className="w-4 h-4" />
                    <p>{errors[name as string]}</p>
                  </div>
                )}
              </>
            )} 
          </div>
          
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
