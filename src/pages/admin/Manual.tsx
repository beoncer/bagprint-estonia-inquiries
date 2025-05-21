
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AdminManual: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel User Manual</h1>
      <p className="text-gray-600 mb-8">
        This guide provides detailed instructions on how to use the admin panel to manage your website content, products, media, and SEO settings.
      </p>

      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="dashboard">
          <AccordionTrigger className="text-xl font-semibold">Dashboard</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">The dashboard provides an overview of your website's key metrics and quick access to all admin functions.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View analytics and recent activity</li>
              <li>Access quick links to popular admin functions</li>
              <li>Monitor system status and important notifications</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="products">
          <AccordionTrigger className="text-xl font-semibold">Product Management</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">The Products section allows you to add, edit, and manage all products on your website.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Adding a New Product</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Click the <strong>Add New Product</strong> button in the top-right corner</li>
              <li>Select the product type from the dropdown (Cotton Bag, Paper Bag, etc.)</li>
              <li>Enter a product name and description</li>
              <li>Add pricing information for different quantities both with and without printing</li>
              <li>Upload a product image</li>
              <li>Click <strong>Add Product</strong> to save</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Editing a Product</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Find the product in the list and click the edit (pencil) icon</li>
              <li>Modify any information as needed</li>
              <li>Click <strong>Save Changes</strong> to update</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Marking Products as Popular</h3>
            <p className="mb-2">Products marked as popular will appear in the "Popular Products" section on the homepage:</p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Find the product in the list</li>
              <li>Click the star icon to toggle popular status</li>
              <li>When the star is filled with yellow, the product is marked as popular</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Deleting a Product</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Find the product in the list and click the delete (trash) icon</li>
              <li>Confirm deletion in the popup dialog</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="content">
          <AccordionTrigger className="text-xl font-semibold">Content Management</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">The Content section allows you to manage all text content displayed on the website.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Adding Content</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Click the <strong>Add New Content</strong> button</li>
              <li>Enter a unique key that will be used to identify this content (e.g., "homepage_title")</li>
              <li>Specify which page this content belongs to</li>
              <li>Enter the content text in the value field</li>
              <li>Click <strong>Add Content</strong> to save</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Quick Text Editing</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Click the <strong>Edit Text</strong> button next to any content item</li>
              <li>Modify the text directly in the textarea that appears</li>
              <li>Click the checkmark icon to save your changes</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Full Content Editing</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Click the edit (pencil) icon to open the full edit dialog</li>
              <li>Modify the key, page, or value as needed</li>
              <li>Click <strong>Save Changes</strong> to update</li>
            </ol>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Content keys must be unique. The combination of key and page is used to display the correct content on each page of the website.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="media">
          <AccordionTrigger className="text-xl font-semibold">Media Library</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">The Media Library allows you to upload and manage images used throughout the website.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Uploading Media</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Click the <strong>Upload New Asset</strong> button</li>
              <li>Select the asset type (Banner, Logo, Product Image, Icon)</li>
              <li>Click "Choose File" and select an image from your computer</li>
              <li>Click <strong>Upload</strong> to save the image</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Using Media in Content</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Find the image you want to use in the media library</li>
              <li>Click on the URL to copy it to your clipboard</li>
              <li>Use this URL when adding or editing products, content, etc.</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Deleting Media</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Find the asset in the list and click the delete (trash) icon</li>
              <li>Confirm deletion in the popup dialog</li>
            </ol>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-700">
                <strong>Warning:</strong> Deleting media that is in use on the website will cause images to break. Make sure to update any content using an image before deleting it.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="seo">
          <AccordionTrigger className="text-xl font-semibold">SEO Management</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">The SEO section allows you to manage metadata for each page to improve search engine visibility.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Adding SEO Data</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Click the <strong>Add New SEO Entry</strong> button</li>
              <li>Enter the page identifier (e.g., "home", "products", "contact")</li>
              <li>Add a meta title (appears in browser tabs and search results)</li>
              <li>Write a meta description (appears in search engine results)</li>
              <li>Add relevant keywords, separated by commas</li>
              <li>Click <strong>Add SEO Data</strong> to save</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Editing SEO Data</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Find the SEO entry in the list and click the edit (pencil) icon</li>
              <li>Modify any information as needed</li>
              <li>Click <strong>Save Changes</strong> to update</li>
            </ol>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Keep meta descriptions between 150-160 characters for optimal display in search results.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
          <CardDescription>Follow these guidelines for optimal website management</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>Regular Updates:</strong> Keep your product information, prices, and content up to date
            </li>
            <li>
              <strong>Image Optimization:</strong> Use properly sized and compressed images for faster loading times
            </li>
            <li>
              <strong>SEO Management:</strong> Regularly update your SEO metadata to improve search engine rankings
            </li>
            <li>
              <strong>Content Organization:</strong> Use consistent naming conventions for content keys and media files
            </li>
            <li>
              <strong>Popular Products:</strong> Regularly update which products are marked as popular to showcase different items
            </li>
            <li>
              <strong>Backup Important Data:</strong> Regularly back up your product and content information
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManual;
