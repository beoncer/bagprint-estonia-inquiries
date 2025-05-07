
import ProductCard, { ProductProps } from "./ProductCard";

interface ProductGridProps {
  products: ProductProps[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductGrid;
