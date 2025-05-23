export interface PageOption {
  value: string;
  label: string;
}

export const fetchPages = async (): Promise<PageOption[]> => {
  // Define available pages in the website
  const pages: PageOption[] = [
    { value: "home", label: "Homepage" },
    { value: "products", label: "Products" },
    { value: "contact", label: "Contact" },
    { value: "inquiry", label: "Inquiry" },
    { value: "global", label: "Global (All Pages)" }
  ];

  return pages;
};
