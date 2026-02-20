export type CSVColumn<T = any> = {
  header: string;
  dataKey: keyof T | string;
  formatter?: (value: any, row: T) => string;
};

export type CSVExportConfig<T = any> = {
  columns: CSVColumn<T>[];
  data: T[];
  fileName: string;
  includeHeaders?: boolean;
};

export class CSVExportGenerator {
  private config: CSVExportConfig;

  constructor(config: CSVExportConfig) {
    this.config = {
      includeHeaders: true,
      ...config,
    };
  }

  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);
    
    // If value contains comma, newline, or quote, wrap in quotes and escape quotes
    if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  private generateCSVContent(): string {
    const { columns, data, includeHeaders } = this.config;
    const rows: string[] = [];

    // Add headers
    if (includeHeaders) {
      const headerRow = columns.map(col => this.escapeCSVValue(col.header)).join(",");
      rows.push(headerRow);
    }

    // Add data rows
    data.forEach(row => {
      const dataRow = columns
        .map(col => {
          const value = row[col.dataKey as keyof typeof row];
          const formattedValue = col.formatter ? col.formatter(value, row) : value;
          return this.escapeCSVValue(formattedValue);
        })
        .join(",");
      rows.push(dataRow);
    });

    return rows.join("\n");
  }

  export() {
    const csvContent = this.generateCSVContent();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", this.config.fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  getBlob(): Blob {
    const csvContent = this.generateCSVContent();
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  }

  getContent(): string {
    return this.generateCSVContent();
  }
}