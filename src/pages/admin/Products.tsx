
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  description: string;
  image_url: string;
  pricing_without_print: Record<string, number>;
  pricing_with_print: Record<string, number>;
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
        setProducts(data);
      }
    } catch (error: any) {
      toast({
        title: "Viga toodete laadimisel",
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
        title: "Viga populaarsete toodete laadimisel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!formData.name || !formData.type) {
        toast({
          title: "Valideerimisviga",
          description: "Nimi ja tüüp on kohustuslikud väljad",
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

      const newProduct = {
        ...formData,
        pricing_without_print: pricingWithoutPrint,
        pricing_with_print: pricingWithPrint,
        image_url: imageUrl,
      };

      const { data, error } = await supabase.from("products").insert(newProduct).select();
      if (error) throw error;

      toast({
        title: "Toode lisatud",
        description: "Toote lisamine õnnestus",
      });

      // Reset form
      setFormData({
        type: "",
        name: "",
        description: "",
        pricing_without_print: {},
        pricing_with_print: {},
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
        title: "Viga toote lisamisel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    try {
      if (!selectedProduct || !formData.name || !formData.type) {
        toast({
          title: "Valideerimisviga",
          description: "Nimi ja tüüp on kohustuslikud väljad",
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

      const updatedProduct = {
        ...formData,
        pricing_without_print: pricingWithoutPrint,
        pricing_with_print: pricingWithPrint,
        image_url: imageUrl,
      };

      const { error } = await supabase
        .from("products")
        .update(updatedProduct)
        .eq("id", selectedProduct.id);
        
      if (error) throw error;

      toast({
        title: "Toode uuendatud",
        description: "Toote uuendamine õnnestus",
      });

      // Reset form and close dialog
      setFormData({
        type: "",
        name: "",
        description: "",
        pricing_without_print: {},
        pricing_with_print: {},
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
        title: "Viga toote uuendamisel",
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
        title: "Toode kustutatud",
        description: "Toote kustutamine õnnestus",
      });

      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (error: any) {
      toast({
        title: "Viga toote kustutamisel",
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
            title: "Eemaldatud populaarsetest",
            description: "Toode on eemaldatud populaarsete toodete hulgast",
          });
        }
      } else {
        // Add to popular products
        const { error } = await supabase
          .from("popular_products")
          .insert({ product_id: productId });
        
        if (error) throw error;
        
        toast({
          title: "Lisatud populaarsetesse",
          description: "Toode on lisatud populaarsete toodete hulka",
        });
      }
      
      await fetchPopularProducts();
    } catch (error: any) {
      toast({
        title: "Viga",
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
      case "cotton_bag": return "Puuvillane kott";
      case "paper_bag": return "Paberkott";
      case "drawstring_bag": return "Nööriga kott";
      case "packaging_box": return "Pakendikarp";
      default: return type;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tooted</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Lisa uus toode
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Muuda toodet" : "Lisa uus toode"}
              </DialogTitle>
              <DialogDescription>
                Täitke väljad toote {selectedProduct ? "muutmiseks" : "lisamiseks"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="type">Toote tüüp</label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vali toote tüüp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton_bag">Puuvillane kott</SelectItem>
                    <SelectItem value="paper_bag">Paberkott</SelectItem>
                    <SelectItem value="drawstring_bag">Nööriga kott</SelectItem>
                    <SelectItem value="packaging_box">Pakendikarp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="name">Toote nimi</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sisesta toote nimi"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Kirjeldus</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Sisesta toote kirjeldus"
                />
              </div>
              <div className="grid gap-2">
                <label>Hinnad ilma trükita</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="price-50" className="text-sm">50 tk</label>
                    <Input
                      id="price-50"
                      value={priceWithout50}
                      onChange={(e) => setPriceWithout50(e.target.value)}
                      placeholder="Hind"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-100" className="text-sm">100 tk</label>
                    <Input
                      id="price-100"
                      value={priceWithout100}
                      onChange={(e) => setPriceWithout100(e.target.value)}
                      placeholder="Hind"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-500" className="text-sm">500 tk</label>
                    <Input
                      id="price-500"
                      value={priceWithout500}
                      onChange={(e) => setPriceWithout500(e.target.value)}
                      placeholder="Hind"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label>Hinnad trükiga</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="price-print-50" className="text-sm">50 tk</label>
                    <Input
                      id="price-print-50"
                      value={priceWith50}
                      onChange={(e) => setPriceWith50(e.target.value)}
                      placeholder="Hind"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-print-100" className="text-sm">100 tk</label>
                    <Input
                      id="price-print-100"
                      value={priceWith100}
                      onChange={(e) => setPriceWith100(e.target.value)}
                      placeholder="Hind"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-print-500" className="text-sm">500 tk</label>
                    <Input
                      id="price-print-500"
                      value={priceWith500}
                      onChange={(e) => setPriceWith500(e.target.value)}
                      placeholder="Hind"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="image">Toote pilt</label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {selectedProduct && selectedProduct.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Praegune pilt:</p>
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="w-32 h-32 object-contain bg-gray-100 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Tühista
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={selectedProduct ? handleEditProduct : handleAddProduct}
              >
                {selectedProduct ? "Salvesta muudatused" : "Lisa toode"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kustuta toode</DialogTitle>
              <DialogDescription>
                Kas olete kindel, et soovite toote kustutada? Seda tegevust ei saa tagasi võtta.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Tühista
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Kustuta
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
                <TableHead>Nimi</TableHead>
                <TableHead>Tüüp</TableHead>
                <TableHead>Hinnad</TableHead>
                <TableHead>Populaarne</TableHead>
                <TableHead className="text-right">Tegevused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    Tooteid pole lisatud
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
                          <p>Ilma trükita: {" "}
                            {Object.entries(product.pricing_without_print)
                              .map(([qty, price]) => `${qty}tk: ${price}€`)
                              .join(", ")}
                          </p>
                          {product.pricing_with_print && Object.keys(product.pricing_with_print).length > 0 && (
                            <p>Trükiga: {" "}
                              {Object.entries(product.pricing_with_print)
                                .map(([qty, price]) => `${qty}tk: ${price}€`)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">Hinnad puuduvad</span>
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
