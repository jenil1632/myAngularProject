export interface PurchaseEntry {

  invoiceno: number;
  invoicedate: Date;
  productName: string;
  qty: number;
  mrp: number;
  rate: number;
  value: number;
  taxRate: number;
  taxAmt: number;
  gross: number;
  customerName: string;
}
