import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Trash2, Edit, Star, StarOff } from "lucide-react";

interface Product {
  id: string;
  type: string;
  name: string;
  description: string | null;
  image_url: string | null;
  pricing_without_print: Record<string, number>;
  pricing_with_print: Record<string, number>;
  slug?: string | null;
  created_at: string;
  updated_at: string;
}

interface PopularProduct {
  id: string;
  product_id: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    type: "",
    name: "",
    description: "",
    pricing_without_print: {},
    pricing_with_print: {},
    slug: "",
  });
  const [priceWithout50, setPriceWithout50] = useState("");
  const [priceWithout100, setPriceWithout100] = useState("");
  const [priceWithout500, setPriceWithout500] = useState("");
  const [priceWith50, setPriceWith50] = useState("");
  const [priceWith100, setPriceWith100] = useState("");
  const [priceWith500, setPriceWith500] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchPopularProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      
      if (data) {
        // Convert Json type to Record<string, number>
        const processedData: Product[] = data.map(product => ({
          ...product,
          pricing_without_print: typeof product.pricing_without_print === 'string' 
            ? JSON.parse(product.pricing_without_print as string) 
            : product.pricing_without_print as Record<string, number>,
          pricing_with_print: typeof product.pricing_with_print === 'string'
            ? JSON.parse(product.pricing_with_print as string)
            : product.pricing_with_print as Record<string, number>
        }));
        setProducts(processedData);
      }
    } catch (error: any) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularProducts = async () => {
    try {
      const { data, error } = await supabase.from("popular_products").select("*");
      if (error) throw error;
      
      if (data) {
        setPopularProducts(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading popular products",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!formData.name || !formData.type) {
        toast({
          title: "Validation error",
          description: "Name and type are required fields",
          variant: "destructive",
        });
        return;
      }

      // Build pricing objects
      const pricingWithoutPrint: Record<string, number> = {};
      if (priceWithout50) pricingWithoutPrint["50"] = parseFloat(priceWithout50);
      if (priceWithout100) pricingWithoutPrint["100"] = parseFloat(priceWithout100);
      if (priceWithout500) pricingWithoutPrint["500"] = parseFloat(priceWithout500);

      const pricingWithPrint: Record<string, number> = {};
      if (priceWith50) pricingWithPrint["50"] = parseFloat(priceWith50);
      if (priceWith100) pricingWithPrint["100"] = parseFloat(priceWith100);
      if (priceWith500) pricingWithPrint["500"] = parseFloat(priceWith500);

      let imageUrl = "";
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(`products/${fileName}`, imageFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from("site-assets")
          .getPublicUrl(`products/${fileName}`);

        imageUrl = data.publicUrl;
      }

      const newProductData = {
        name: formData.name,
        type: formData.type,
        description: formData.description || null,
        image_url: imageUrl || null,
        pricing_without_print: pricingWithoutPrint,
        pricing_with_print: pricingWithPrint,
        slug: formData.slug || null,
      };

      const { data, error } = await supabase.from("products").insert(newProductData).select();
      if (error) throw error;

      toast({
        title: "Product added",
        description: "Product has been added successfully",
      });

      // Reset form
      setFormData({
        type: "",
        name: "",
        description: "",
        pricing_without_print: {},
        pricing_with_print: {},
        slug: "",
      });
      setPriceWithout50("");
      setPriceWithout100("");
      setPriceWithout500("");
      setPriceWith50("");
      setPriceWith100("");
      setPriceWith500("");
      setImageFile(null);
      setIsDialogOpen(false);
      
      await fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    try {
      if (!selectedProduct || !formData.name || !formData.type) {
        toast({
          title: "Validation error",
          description: "Name and type are required fields",
          variant: "destructive",
        });
        return;
      }

      // Build pricing objects
      const pricingWithoutPrint: Record<string, number> = {};
      if (priceWithout50) pricingWithoutPrint["50"] = parseFloat(priceWithout50);
      if (priceWithout100) pricingWithoutPrint["100"] = parseFloat(priceWithout100);
      if (priceWithout500) pricingWithoutPrint["500"] = parseFloat(priceWithout500);

      const pricingWithPrint: Record<string, number> = {};
      if (priceWith50) pricingWithPrint["50"] = parseFloat(priceWith50);
      if (priceWith100) pricingWithPrint["100"] = parseFloat(priceWith100);
      if (priceWith500) pricingWithPrint["500"] = parseFloat(priceWith500);

      let imageUrl = selectedProduct.image_url;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(`products/${fileName}`, imageFile);

        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from("site-assets")
          .getPublicUrl(`products/${fileName}`);

        imageUrl = data.publicUrl;
      }

      const updatedProductData = {
        name: formData.name,
        type: formData.type,
        description: formData.description || null,
        image_url: imageUrl,
        pricing_without_print: pricingWithoutPrint,
        pricing_with_print: pricingWithPrint,
        slug: formData.slug || null,
      };

      const { error } = await supabase
        .from("products")
        .update(updatedProductData)
        .eq("id", selectedProduct.id);
        
      if (error) throw error;

      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });

      // Reset form and close dialog
      setFormData({
        type: "",
        name: "",
        description: "",
        pricing_without_print: {},
        pricing_with_print: {},
        slug: "",
      });
      setPriceWithout50("");
      setPriceWithout100("");
      setPriceWithout500("");
      setPriceWith50("");
      setPriceWith100("");
      setPriceWith500("");
      setImageFile(null);
      setSelectedProduct(null);
      setIsDialogOpen(false);
      
      await fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (!selectedProduct) return;

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);
        
      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      type: product.type,
      name: product.name,
      description: product.description || "",
      slug: product.slug || "",
    });
    
    // Set pricing fields
    setPriceWithout50(product.pricing_without_print?.["50"]?.toString() || "");
    setPriceWithout100(product.pricing_without_print?.["100"]?.toString() || "");
    setPriceWithout500(product.pricing_without_print?.["500"]?.toString() || "");
    setPriceWith50(product.pricing_with_print?.["50"]?.toString() || "");
    setPriceWith100(product.pricing_with_print?.["100"]?.toString() || "");
    setPriceWith500(product.pricing_with_print?.["500"]?.toString() || "");
    
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const isPopular = (productId: string) => {
    return popularProducts.some(pp => pp.product_id === productId);
  };

  const handleTogglePopular = async (productId: string) => {
    try {
      if (isPopular(productId)) {
        // Remove from popular products
        const productToRemove = popularProducts.find(pp => pp.product_id === productId);
        if (productToRemove) {
          const { error } = await supabase
            .from("popular_products")
            .delete()
            .eq("id", productToRemove.id);
          
          if (error) throw error;
          
          toast({
            title: "Removed from popular",
            description: "Product has been removed from popular products",
          });
        }
      } else {
        // Add to popular products
        const { error } = await supabase
          .from("popular_products")
          .insert({ product_id: productId });
        
        if (error) throw error;
        
        toast({
          title: "Added to popular",
          description: "Product has been added to popular products",
        });
      }
      
      await fetchPopularProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setFormData({
      type: "",
      name: "",
      description: "",
      pricing_without_print: {},
      pricing_with_print: {},
      slug: "",
    });
    setPriceWithout50("");
    setPriceWithout100("");
    setPriceWithout500("");
    setPriceWith50("");
    setPriceWith100("");
    setPriceWith500("");
    setImageFile(null);
  };

  const translateProductType = (type: string) => {
    switch (type) {
      case "cotton_bag": return "Cotton Bag";
      case "paper_bag": return "Paper Bag";
      case "drawstring_bag": return "Drawstring Bag";
      case "packaging_box": return "Packaging Box";
      default: return type;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                Fill in the fields to {selectedProduct ? "edit" : "add"} a product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="type">Product Type</label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton_bag">Cotton Bag</SelectItem>
                    <SelectItem value="paper_bag">Paper Bag</SelectItem>
                    <SelectItem value="drawstring_bag">Drawstring Bag</SelectItem>
                    <SelectItem value="packaging_box">Packaging Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="name">Product Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                />
              </div>
              <div className="grid gap-2">
                <label>Prices without print</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="price-50" className="text-sm">50 pcs</label>
                    <Input
                      id="price-50"
                      value={priceWithout50}
                      onChange={(e) => setPriceWithout50(e.target.value)}
                      placeholder="Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-100" className="text-sm">100 pcs</label>
                    <Input
                      id="price-100"
                      value={priceWithout100}
                      onChange={(e) => setPriceWithout100(e.target.value)}
                      placeholder="Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-500" className="text-sm">500 pcs</label>
                    <Input
                      id="price-500"
                      value={priceWithout500}
                      onChange={(e) => setPriceWithout500(e.target.value)}
                      placeholder="Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label>Prices with print</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="price-print-50" className="text-sm">50 pcs</label>
                    <Input
                      id="price-print-50"
                      value={priceWith50}
                      onChange={(e) => setPriceWith50(e.target.value)}
                      placeholder="Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-print-100" className="text-sm">100 pcs</label>
                    <Input
                      id="price-print-100"
                      value={priceWith100}
                      onChange={(e) => setPriceWith100(e.target.value)}
                      placeholder="Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-print-500" className="text-sm">500 pcs</label>
                    <Input
                      id="price-print-500"
                      value={priceWith500}
                      onChange={(e) => setPriceWith500(e.target.value)}
                      placeholder="Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="image">Product Image</label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {selectedProduct && selectedProduct.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Current image:</p>
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="w-32 h-32 object-contain bg-gray-100 rounded"
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="slug">Product URL Slug</label>
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. premium-cotton-tote-bag"
                />
                <span className="text-xs text-gray-500">This will be used in the product URL: /tooted/&lt;slug&gt;</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={selectedProduct ? handleEditProduct : handleAddProduct}
              >
                {selectedProduct ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prices</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No products added
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-contain bg-gray-100 rounded"
                          />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{translateProductType(product.type)}</TableCell>
                    <TableCell>
                      {product.pricing_without_print && Object.keys(product.pricing_without_print).length > 0 ? (
                        <div className="text-sm">
                          <p>Without print: {" "}
                            {Object.entries(product.pricing_without_print)
                              .map(([qty, price]) => `${qty}pcs: €${price}`)
                              .join(", ")}
                          </p>
                          {product.pricing_with_print && Object.keys(product.pricing_with_print).length > 0 && (
                            <p>With print: {" "}
                              {Object.entries(product.pricing_with_print)
                                .map(([qty, price]) => `${qty}pcs: €${price}`)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No prices available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePopular(product.id)}
                      >
                        {isPopular(product.id) ? (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
