// Product utility functions and mock data

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  startingPrice: number;
  slug: string;
}

// Mock products data
export const mockProducts: ProductProps[] = [
  {
    id: "1",
    name: "Premium Cotton Tote Bag",
    description: "High-quality cotton tote bag perfect for everyday use",
    image: "/placeholder.svg",
    category: "cotton_bag",
    startingPrice: 5.99,
    slug: "premium-cotton-tote-bag"
  },
  {
    id: "2", 
    name: "Eco-Friendly Paper Bag",
    description: "Sustainable paper bag made from recycled materials",
    image: "/placeholder.svg",
    category: "paper_bag",
    startingPrice: 2.49,
    slug: "eco-friendly-paper-bag"
  },
  {
    id: "3",
    name: "Drawstring Sports Bag", 
    description: "Perfect for gym and sports activities",
    image: "/placeholder.svg",
    category: "drawstring_bag",
    startingPrice: 8.99,
    slug: "drawstring-sports-bag"
  },
  {
    id: "4",
    name: "Custom Packaging Box",
    description: "Professional packaging solution for e-commerce",
    image: "/placeholder.svg", 
    category: "packaging",
    startingPrice: 12.99,
    slug: "custom-packaging-box"
  }
];
