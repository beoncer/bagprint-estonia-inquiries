export interface PageOption {
  value: string;
  label: string;
}

export const fetchPages = async (): Promise<PageOption[]> => {
  // Define available pages in the website - matches DynamicSEO component mapping
  const pages: PageOption[] = [
    { value: "home", label: "Homepage" },
    { value: "products", label: "Tooted (Products)" },
    { value: "cotton-bags", label: "Riidest kotid (Cotton Bags)" },
    { value: "paper-bags", label: "Paberkotid (Paper Bags)" },
    { value: "drawstring-bags", label: "Nööriga kotid (Drawstring Bags)" },
    { value: "shoebags", label: "Sussikotid (Shoe Bags)" },
    { value: "contact", label: "Kontakt (Contact)" },
    { value: "about", label: "Meist (About)" },
    { value: "portfolio", label: "Portfoolio (Portfolio)" },
    { value: "blog", label: "Blogi (Blog)" },
    { value: "admin", label: "Admin" },
    { value: "inquiry", label: "Inquiry" },
    { value: "global", label: "Global (All Pages)" }
  ];

  return pages;
};
