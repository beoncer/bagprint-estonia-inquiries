
import ProductCard, { ProductProps } from "./ProductCard";

interface ProductGridProps {
  products: ProductProps[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
