export type ReportColumn = {
    header: string;
    dataKey: string;
    width?: number;
    formatter?: (value: any, row: any) => string;
};
