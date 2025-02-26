export function formatColumns(columns: string[], defaultColumns: string[]=[]): string {
    if (columns.length === 0) {
        return "*";
    } else {
        const combinedColumns = new Set([...columns, ...defaultColumns]);
        return Array.from(combinedColumns).join(", ");
    }
}
