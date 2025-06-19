export const PRODUCT_COLORS = [
  { value: "naturalne", label: "Naturaalne" },
  { value: "oranz", label: "Oranž" },
  { value: "pehme_kollane", label: "Pehme kollane" },
  { value: "punane", label: "Punane" },
  { value: "roosa", label: "Roosa" },
  { value: "royal_sinine", label: "Royal sinine" },
  { value: "taevasinine", label: "Taevasinine" },
  { value: "tume_roheline", label: "Tume roheline" },
  { value: "tume_sinine", label: "Tume sinine" },
  { value: "valge", label: "Valge" },
  { value: "granate", label: "Granate" },
  { value: "hall", label: "Hall" },
  { value: "hele_roheline", label: "Hele roheline" },
  { value: "kollane", label: "Kollane" },
  { value: "lilla", label: "Lilla" },
  { value: "must", label: "Must" }
] as const;

export type ProductColor = typeof PRODUCT_COLORS[number]["value"]; 