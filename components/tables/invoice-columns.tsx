'use client';

import { DataTable } from '@/components/data-table';
import { Invoice, invoiceColumns } from '@/components/tables/invoice-table';

export function InvoiceTable({ data, pageSize }: { data: Invoice[]; pageSize: number }) {
  return (
    <DataTable columns={invoiceColumns} data={data} pageSize={pageSize} showPaging height={12} />
  );
}
