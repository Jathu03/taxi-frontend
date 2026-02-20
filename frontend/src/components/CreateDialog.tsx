"use client";

import { useState } from "react";
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
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

type Field<T> =
  | {
      name: keyof T;
      label: string;
      placeholder?: string;
      type: "text" | "number" | "date" | "textarea" | "email" | "input";
      validate?: (value: any) => string | null;
    }
  | {
      name: keyof T;
      label: string;
      type: "select";
      options: string[];
      validate?: (value: any) => string | null;
    }
  | {
      name: keyof T;
      label: string;
      type: "checkbox";
      validate?: (value: any) => string | null;
    };

interface CreateDialogProps<T> {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  initialValues: Partial<T>;
  fields: Field<T>[];
  onSubmit: (values: Partial<T>) => void;
}

export function CreateDialog<T>({
  open,
  setOpen,
  title,
  description,
  initialValues,
  onSubmit,
  fields,
}: CreateDialogProps<T>) {
  const [values, setValues] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

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
      <DialogTrigger asChild>
        {/* Empty trigger, open controlled externally */}
        <></>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-4">
          {fields.map((field) => {
            const { name, label, type } = field;

            const placeholder =
            type === "text" ||
            type === "number" ||
            type === "email" ||
            type === "date" ||
            type === "textarea" ||
            type === "input"
              ? (field as { placeholder?: string }).placeholder
              : undefined;

            return (
              <div key={name as string} className="grid gap-1">
                <Label htmlFor={name as string}>{label}</Label>

                {(type === "text" ||
                  type === "input" ||
                  type === "email" ||
                  type === "date") && (
                  <Input
                    id={name as string}
                    type={type === "email" ? "email" : type === "date" ? "date" : "text"}
                    value={values[name] as any}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(name, e.target.value)}
                    className="w-full flex flex-col"
                  />
                )}

                {type === "number" && (
                  <Input
                    id={name as string}
                    type="number"
                    value={values[name] as any}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(name, e.target.valueAsNumber)}
                  />
                )}

                {type === "textarea" && (
                  <Textarea
                    id={name as string}
                    value={values[name] as any}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(name, e.target.value)}
                  />
                )}

                {type === "select" && "options" in field && (
                  <Select
                    value={values[name] as string}
                    onValueChange={(val) => handleChange(name, val)}
                  >
                    <SelectTrigger id={name as string}>
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
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

                {errors[name as string] && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircleIcon className="w-4 h-4" />
                    <p>{errors[name as string]}</p>
                  </div>
                )}
              </div>
            );
          })}
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
