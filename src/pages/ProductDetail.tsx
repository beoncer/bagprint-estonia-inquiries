import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Phone, Mail, Check } from "lucide-react";
import { ProductProps } from "@/components/product/ProductCard";
import ProductBadge from "@/components/product/ProductBadge";
import { BadgeType } from "@/lib/badge-constants";
import { usePricing } from "@/hooks/usePricing";
import ColorPicker from "@/components/product/ColorPicker";
import { ProductColor } from "@/lib/constants";
import InquiryForm from "@/components/ui/InquiryForm";
import { useToast } from "@/hooks/use-toast";
import ProductTechnicalDetails from "@/components/product/ProductTechnicalDetails";
import ProductStructuredData from "@/components/seo/ProductStructuredData";
import DynamicSEO from "@/components/seo/DynamicSEO";
import Breadcrumb from "@/components/ui/breadcrumb";

interface ProductDetailParams {
  slug: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const fetchProduct = async (slug: string): Promise<ProductProps | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error("Supabase error fetching product:", error);
    throw new Error(error.message);
  }

  return data;
};

const fetchFAQs = async (productType: string): Promise<FAQItem[]> => {
  const { data, error } = await supabase
    .from('website_content')
    .select('key, value')
    .eq('page', 'product_pages')
    .like('key', `${productType}_faq_%`);

  if (error) {
    console.error("Supabase error fetching FAQs:", error);
    return [];
  }

  const faqs: FAQItem[] = [];
  if (data) {
    const questions = data.filter((item: any) => item.key.includes('_question'));
    const answers = data.filter((item: any) => item.key.includes('_answer'));

    questions.forEach((questionItem: any) => {
      const index = questionItem.key.split('_')[2];
      const answerItem = answers.find((answer: any) => answer.key === `${productType}_faq_${index}_answer`);

      if (answerItem) {
        faqs.push({
          question: questionItem.value,
          answer: answerItem.value,
        });
      }
    });
  }

  return faqs;
};

const ProductDetail = () => {
  const { slug } = useParams<ProductDetailParams>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug!),
    enabled: !!slug,
    retry: false,
  });

  const { data: faqs, isLoading: faqsLoading } = useQuery({
    queryKey: ['faqs', product?.type],
    queryFn: () => fetchFAQs(product?.type!),
    enabled: !!product?.type,
  });

  const { calculatePrice } = usePricing();

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!slug) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">Missing product slug</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tagasi
          </Button>
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Product not found</h2>
            <p className="text-gray-600">Check the URL or browse our other products.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Lisatud ostukorvi!",
      description: "Toode on edukalt ostukorvi lisatud.",
    });
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
  };

  const handleShowInquiryForm = () => {
    setShowInquiryForm(true);
  };

  const handleCloseInquiryForm = () => {
    setShowInquiryForm(false);
  };

  const getPriceDisplay = () => {
    if (!product) return null;

    const priceResult = calculatePrice({
      basePrice: product.base_price,
      quantity: quantity,
      withPrint: false
    });

    if (priceResult) {
      return `€${priceResult.totalPrice.toFixed(2)}`;
    }

    return `€${product.base_price.toFixed(2)}`;
  };

  return (
    <>
      <ProductStructuredData product={product} />
      <DynamicSEO
        title={product.seo_title || product.name}
        description={product.seo_description || product.description || ""}
        keywords={product.seo_keywords || ""}
      />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Add Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb />
          </div>

          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tagasi
          </Button>

          <div className="lg:flex lg:space-x-8">
            {/* Product Image */}
            <div className="mb-6 lg:mb-0 lg:w-1/2">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-2 mb-4">
                {product.badges && product.badges.map((badge) => (
                  <ProductBadge key={badge} badge={badge} />
                ))}
                {product.is_eco && (
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-1" />
                    Eco
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Pricing */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl font-bold text-gray-900">{getPriceDisplay()}</span>
                <span className="text-gray-500">Hind sisaldab KM</span>
              </div>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Värvid</h3>
                  <ColorPicker
                    colors={product.colors}
                    selectedColor={selectedColor}
                    onColorSelect={handleColorSelect}
                  />
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center space-x-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Kogus</h3>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    onClick={handleDecreaseQuantity}
                    className="px-4 py-2 rounded-l-md"
                    variant="ghost"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2">{quantity}</span>
                  <Button
                    onClick={handleIncreaseQuantity}
                    className="px-4 py-2 rounded-r-md"
                    variant="ghost"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full mb-4" onClick={handleAddToCart}>
                Lisa ostukorvi
              </Button>

              {/* Inquiry Button */}
              <Button variant="secondary" className="w-full" onClick={handleShowInquiryForm}>
                Küsi pakkumist
              </Button>
            </div>
          </div>

          {/* Technical Details */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tehnilised detailid</h2>
            <ProductTechnicalDetails product={product} />
          </section>

          {/* FAQ Section */}
          {faqs && faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Korduma Kippuvad Küsimused</h2>
              <div className="space-y-4">
                {faqsLoading ? (
                  <div>Loading FAQs...</div>
                ) : (
                  faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-300 rounded-md p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <InquiryForm
          productName={product.name}
          productType={product.type}
          onClose={handleCloseInquiryForm}
        />
      )}
    </>
  );
};

export default ProductDetail;
