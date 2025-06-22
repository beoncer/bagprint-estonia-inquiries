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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon, Trash2, Edit, Star, StarOff, X, Check, ChevronsUpDown } from "lucide-react";
import { PRODUCT_COLORS, ProductColor } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeType, BADGE_CONFIGS } from "@/lib/badge-constants";
import { cn } from "@/lib/utils";
import { usePricing } from "@/hooks/usePricing";

interface Product {
  id: string;
  type: string;
  name: string;
  description: string | null;
  image_url: string | null;
  base_price: number;
  slug?: string | null;
  created_at: string;
  updated_at: string;
  colors: ProductColor[];
  sizes: string[];
  is_eco?: boolean;
  badges: BadgeType[];
  material?: string | null;
}

interface PopularProduct {
  id: string;
  product_id: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    type: "",
    name: "",
    description: "",
    base_price: 0,
    slug: "",
    material: "",
  });
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isEco, setIsEco] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<BadgeType[]>([]);
  const [materialComboOpen, setMaterialComboOpen] = useState(false);
  const [materialSearchValue, setMaterialSearchValue] = useState("");
  
  const { calculatePrice } = usePricing();

  useEffect(() => {
    fetchProducts();
    fetchPopularProducts();
    fetchAvailableMaterials();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedColors(selectedProduct.colors || []);
      setSelectedSizes(selectedProduct.sizes || []);
      setSelectedBadges(selectedProduct.badges || []);
      setIsEco(selectedProduct.is_eco || false);
    } else {
      setSelectedColors([]);
      setSelectedSizes([]);
      setSelectedBadges([]);
      setIsEco(false);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      
      if (data) {
        setProducts(data);
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

  const fetchAvailableMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("material")
        .not("material", "is", null);
      
      if (error) throw error;
      
      const materials = [...new Set(data.map(item => item.material).filter(Boolean))];
      setAvailableMaterials(materials);
    } catch (error: any) {
      console.error("Error fetching materials:", error);
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
      if (!formData.name || !formData.type || !formData.base_price) {
        toast({
          title: "Validation error",
          description: "Name, type, and base price are required fields",
          variant: "destructive",
        });
        return;
      }

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
        base_price: formData.base_price,
        slug: formData.slug || null,
        material: formData.material || null,
        colors: selectedColors,
        sizes: selectedSizes,
        is_eco: isEco,
        badges: selectedBadges,
      };

      const { data, error } = await supabase.from("products").insert(newProductData).select();
      if (error) throw error;

      toast({
        title: "Product added",
        description: "Product has been added successfully",
      });

      handleDialogClose();
      await fetchProducts();
      await fetchAvailableMaterials();
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
      if (!selectedProduct || !formData.name || !formData.type || !formData.base_price) {
        toast({
          title: "Validation error",
          description: "Name, type, and base price are required fields",
          variant: "destructive",
        });
        return;
      }

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
        base_price: formData.base_price,
        slug: formData.slug || null,
        material: formData.material || null,
        colors: selectedColors,
        sizes: selectedSizes,
        is_eco: isEco,
        badges: selectedBadges,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("products")
        .update(updatedProductData)
        .eq("id", selectedProduct.id)
        .select();

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });

      handleDialogClose();
      await fetchProducts();
      await fetchAvailableMaterials();
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
      base_price: product.base_price,
      slug: product.slug || "",
      material: product.material || "",
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'base_price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
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
      base_price: 0,
      slug: "",
      material: "",
    });
    setImageFile(null);
    setMaterialSearchValue("");
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

  const handleColorSelect = (color: ProductColor) => {
    if (!selectedColors.includes(color)) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleColorRemove = (color: ProductColor) => {
    setSelectedColors(selectedColors.filter(c => c !== color));
  };

  const handleSizeAdd = (size: string) => {
    if (size.trim() && !selectedSizes.includes(size.trim())) {
      setSelectedSizes([...selectedSizes, size.trim()]);
    }
  };

  const handleSizeRemove = (size: string) => {
    setSelectedSizes(selectedSizes.filter(s => s !== size));
  };

  const handleBadgeToggle = (badge: BadgeType) => {
    setSelectedBadges(prev => 
      prev.includes(badge)
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  const handleMaterialSelect = (material: string) => {
    setFormData(prev => ({
      ...prev,
      material: material
    }));
    setMaterialComboOpen(false);
    setMaterialSearchValue("");
  };

  const handleAddNewMaterial = () => {
    if (materialSearchValue.trim()) {
      const newMaterial = materialSearchValue.trim();
      setFormData(prev => ({
        ...prev,
        material: newMaterial
      }));
      // Add to available materials list for future use
      if (!availableMaterials.includes(newMaterial)) {
        setAvailableMaterials(prev => [...prev, newMaterial]);
      }
      setMaterialComboOpen(false);
      setMaterialSearchValue("");
    }
  };

  const getPriceDisplay = (product: Product) => {
    const priceResult = calculatePrice({
      basePrice: product.base_price,
      quantity: 50,
      withPrint: false
    });
    
    if (priceResult) {
      return `From €${priceResult.pricePerItem.toFixed(2)} (50pcs)`;
    }
    
    return `Base: €${product.base_price.toFixed(2)}`;
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
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                Fill in the fields to {selectedProduct ? "edit" : "add"} a product.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton_bag">Cotton Bag</SelectItem>
                    <SelectItem value="paper_bag">Paper Bag</SelectItem>
                    <SelectItem value="string_bag">String Bag</SelectItem>
                    <SelectItem value="shoe_bag">Shoe Bag</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Input
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Textarea
                  name="description"
                  placeholder="Product Description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Input
                  name="slug"
                  placeholder="Product URL Slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Input
                  name="base_price"
                  type="number"
                  step="0.01"
                  placeholder="Base Price (€)"
                  value={formData.base_price || ""}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500">
                  This is the base price that will be used with quantity multipliers and print costs
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Material</label>
                <Popover open={materialComboOpen} onOpenChange={setMaterialComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={materialComboOpen}
                      className="w-full justify-between"
                    >
                      {formData.material || "Select or add material..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search or add material..." 
                        value={materialSearchValue}
                        onValueChange={setMaterialSearchValue}
                      />
                      <CommandEmpty>
                        <div className="p-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={handleAddNewMaterial}
                            disabled={!materialSearchValue.trim()}
                          >
                            Add "{materialSearchValue}"
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {availableMaterials.map((material) => (
                          <CommandItem
                            key={material}
                            value={material}
                            onSelect={() => handleMaterialSelect(material)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.material === material ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {material}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Colors</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedColors.map(color => (
                    <Badge key={color} variant="secondary" className="flex items-center gap-1">
                      {PRODUCT_COLORS.find(c => c.value === color)?.label}
                      <button
                        onClick={() => handleColorRemove(color)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select
                  value=""
                  onValueChange={(value) => handleColorSelect(value as ProductColor)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add color" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_COLORS.map(color => (
                      <SelectItem
                        key={color.value}
                        value={color.value}
                        disabled={selectedColors.includes(color.value)}
                      >
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sizes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSizes.map(size => (
                    <Badge key={size} variant="secondary" className="flex items-center gap-1">
                      {size}
                      <button
                        onClick={() => handleSizeRemove(size)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add size (e.g., 38x42cm)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSizeAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Product Badges</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(BADGE_CONFIGS).map((config) => (
                    <button
                      key={config.id}
                      type="button"
                      onClick={() => handleBadgeToggle(config.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors",
                        "bg-white hover:bg-gray-50",
                        selectedBadges.includes(config.id)
                          ? "border-2"
                          : "border opacity-50"
                      )}
                      style={{
                        borderColor: config.borderColor,
                        color: config.borderColor,
                      }}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {selectedProduct?.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Current image:</p>
                    <img
                      src={selectedProduct.image_url}
                      alt="Current product"
                      className="mt-1 max-h-40 rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-eco"
                  checked={isEco}
                  onCheckedChange={(checked) => setIsEco(checked as boolean)}
                />
                <label
                  htmlFor="is-eco"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Öko toode
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button onClick={selectedProduct ? handleEditProduct : handleAddProduct}>
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
                <TableHead>Material</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
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
                    <TableCell>{product.material || "—"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getPriceDisplay(product)}
                      </div>
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
