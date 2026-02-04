import * as XLSX from 'xlsx';
import products from '@/data/products.json';
import { SalesData } from '@/hooks/useSales';

export function exportToExcel(salesData: SalesData): void {
  // Prepare data for Excel
  const data = products.map((product) => ({
    Producto: product.name,
    Cantidad: salesData[product.id] || 0,
  }));

  // Add total row
  const total = Object.values(salesData).reduce((sum, count) => sum + count, 0);
  data.push({
    Producto: 'TOTAL',
    Cantidad: total,
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

  // Set column widths
  worksheet['!cols'] = [{ wch: 25 }, { wch: 12 }];

  // Generate filename with current date (dd_mm_aaaa format)
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const filename = `ventas_${day}_${month}_${year}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, filename);
}
