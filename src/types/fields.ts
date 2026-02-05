type InputField<T, K extends keyof T = keyof T> = {
    name: K;
    label: string;
    placeholder?: string;
    type: "text" | "number" | "date" | "textarea" | "input";
    validate?: (value: T[K]) => string | null;
};

type SelectField<T, K extends keyof T = keyof T> = {
    name: K;
    label: string;
    type: "select";
    options: string[];
    validate?: (value: T[K]) => string | null;
}

type CheckboxField<T, K extends keyof T = keyof T> = {
    name: K;
    label: string;
    type: "checkbox";
    validate?: (value: T[K]) => string | null;
};

export type Field<T> = InputField<T> | SelectField<T> | CheckboxField<T>;