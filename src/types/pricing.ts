export interface QuantityRange {
  start: number;
  end: number | null; // null means no upper limit
  multiplier: number;
}

export interface PrintPrice {
  colorCount: number;
  price: number;
}

export const QUANTITY_RANGES: QuantityRange[] = [
  { start: 50, end: 100, multiplier: 1 },
  { start: 101, end: 200, multiplier: 0.95 },
  { start: 201, end: 300, multiplier: 0.9 },
  { start: 301, end: 500, multiplier: 0.85 },
  { start: 501, end: 800, multiplier: 0.8 },
  { start: 801, end: 1000, multiplier: 0.75 },
  { start: 1001, end: null, multiplier: 0.7 },
];

export const COLOR_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const PRINT_PRICES: PrintPrice[] = [
  { colorCount: 1, price: 0.5 },
  { colorCount: 2, price: 0.8 },
  { colorCount: 3, price: 1.1 },
  { colorCount: 4, price: 1.4 },
  { colorCount: 5, price: 1.7 },
  { colorCount: 6, price: 2.0 },
  { colorCount: 7, price: 2.3 },
  { colorCount: 8, price: 2.6 },
]; 