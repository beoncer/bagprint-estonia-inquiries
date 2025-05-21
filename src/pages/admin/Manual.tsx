
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminManual: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel User Manual</h1>
      <p className="text-gray-600 mb-8">
        Welcome to the bagprint.ee admin panel. This manual will help you navigate and use all the features of the admin system.
      </p>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel Overview</CardTitle>
              <CardDescription>
                Understanding the basic structure and functionality of the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p>
                  The bagprint.ee admin panel is designed to help you manage all aspects of your e-commerce website.
                  The panel is divided into several sections, each handling a specific part of your website:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Dashboard</strong> - Provides an overview of your website's content and statistics.
                  </li>
                  <li>
                    <strong>Products</strong> - Manage your product catalog including cotton bags, paper bags, drawstring bags, and e-commerce packaging boxes.
                  </li>
                  <li>
                    <strong>Content</strong> - Edit website text content, including homepage sections and other page content.
                  </li>
                  <li>
                    <strong>Media</strong> - Upload and manage website images, including the banner and logo.
                  </li>
                  <li>
                    <strong>SEO</strong> - Manage SEO settings for all pages to improve search engine visibility.
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium mt-6">Navigation</h3>
                <p>
                  Use the sidebar on the left to navigate between different sections of the admin panel.
                  You can collapse the sidebar using the toggle button in the top-right corner of the sidebar.
                </p>

                <h3 className="text-lg font-medium mt-6">Account Management</h3>
                <p>
                  Your account information is displayed at the bottom of the sidebar. You can log out using the "Log out" button.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Managing Products</CardTitle>
              <CardDescription>
                Learn how to add, edit, and remove products from your catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Adding New Products</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>To add a new product to your catalog:</p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Navigate to the Products section from the sidebar</li>
                        <li>Click the "Add New Product" button at the top of the page</li>
                        <li>Fill in all required fields in the product form:
                          <ul className="list-disc pl-6 mt-2">
                            <li><strong>Name</strong> - The product name that will be displayed to customers</li>
                            <li><strong>Description</strong> - A detailed description of the product</li>
                            <li><strong>Type</strong> - Select the appropriate product category (cotton bag, paper bag, etc.)</li>
                            <li><strong>Image URL</strong> - Upload or provide a URL for the product image</li>
                            <li><strong>Pricing Without Print</strong> - Set prices for different quantity brackets</li>
                            <li><strong>Pricing With Print</strong> - Set prices for printed versions at different quantities</li>
                          </ul>
                        </li>
                        <li>Click "Save" to add the product to your catalog</li>
                      </ol>
                      <p className="text-sm text-gray-500 mt-4">
                        Note: All products added will automatically appear on the website's product page once saved.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Editing Existing Products</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>To edit an existing product:</p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Navigate to the Products section from the sidebar</li>
                        <li>Find the product you want to edit in the product list</li>
                        <li>Click the "Edit" button next to the product</li>
                        <li>Update the product information as needed</li>
                        <li>Click "Save" to apply your changes</li>
                      </ol>
                      <p>
                        You can update any aspect of the product, including pricing, descriptions, and images.
                        Changes will be reflected immediately on the website.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Setting Product Prices</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>
                        Products have two pricing structures: with print and without print. Each pricing structure contains 
                        different price points based on quantity (e.g., 50, 100, 500 units).
                      </p>
                      <p>To set up pricing:</p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>When editing or adding a product, locate the pricing sections</li>
                        <li>For "Pricing Without Print", add quantity brackets and corresponding prices</li>
                        <li>For "Pricing With Print", add the prices for the same quantity brackets with custom printing</li>
                      </ol>
                      <p>
                        The pricing is structured as a JSON object where keys are quantity values and values are prices.
                        For example:
                      </p>
                      <pre className="bg-gray-100 p-2 rounded">
{`{
  "50": 100,
  "100": 180,
  "500": 800
}`}
                      </pre>
                      <p>This means: 50 units for €100, 100 units for €180, and 500 units for €800.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Deleting Products</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>To delete a product from your catalog:</p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Navigate to the Products section from the sidebar</li>
                        <li>Find the product you want to remove</li>
                        <li>Click the "Delete" button for that product</li>
                        <li>Confirm the deletion in the confirmation dialog</li>
                      </ol>
                      <p className="text-red-500 font-medium">
                        Warning: Deleting a product is permanent and cannot be undone. The product will be immediately 
                        removed from your website.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Managing Website Content</CardTitle>
              <CardDescription>
                Learn how to update text and content on different pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p>
                  The Content section allows you to manage all text content throughout your website. You can edit content 
                  for the homepage, about section, contact page, and other important sections.
                </p>
                
                <h3 className="text-lg font-medium">Editing Page Content</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the Content section from the sidebar</li>
                  <li>Select the page or section you want to edit</li>
                  <li>Update the content in the provided editor</li>
                  <li>Click "Save Changes" to publish your updates</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-6">Content Types</h3>
                <p>You can edit several types of content:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Page Headings</strong> - Main titles and section headers</li>
                  <li><strong>Descriptions</strong> - Detailed text explaining your products or services</li>
                  <li><strong>Call-to-Action Text</strong> - Text for buttons and promotional sections</li>
                  <li><strong>FAQ Content</strong> - Questions and answers for your FAQ section</li>
                </ul>
                
                <p className="text-sm text-gray-500 mt-4">
                  Tip: Keep your content concise and focused on the benefits of your products for better customer engagement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Managing Media Assets</CardTitle>
              <CardDescription>
                Learn how to update your website's banner and logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p>
                  The Media section allows you to manage the visual elements of your website, particularly the main banner and logo.
                </p>
                
                <h3 className="text-lg font-medium">Updating the Banner</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the Media section from the sidebar</li>
                  <li>Find the "Website Banner" card</li>
                  <li>Click "Choose File" to select a new banner image from your computer</li>
                  <li>Click "Save Banner" to upload and apply the new banner</li>
                </ol>
                <p className="text-sm text-gray-500">
                  Recommended banner size: 1920x640px. Maximum file size: 5MB.
                </p>
                
                <h3 className="text-lg font-medium mt-6">Updating the Logo</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the Media section from the sidebar</li>
                  <li>Find the "Website Logo" card</li>
                  <li>Click "Choose File" to select a new logo image from your computer</li>
                  <li>Click "Save Logo" to upload and apply the new logo</li>
                </ol>
                <p className="text-sm text-gray-500">
                  Recommended logo size: 200x80px. Maximum file size: 2MB.
                </p>
                
                <h3 className="text-lg font-medium mt-6">Image Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use high-quality images with good resolution</li>
                  <li>Ensure your images are properly compressed to maintain fast website loading times</li>
                  <li>For the banner, use images that showcase your products or brand message</li>
                  <li>For the logo, use a clear, professional version of your company logo</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Managing SEO Settings</CardTitle>
              <CardDescription>
                Learn how to optimize your website for search engines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p>
                  The SEO section allows you to manage search engine optimization settings for each page of your website.
                  This helps improve your visibility in search results.
                </p>
                
                <h3 className="text-lg font-medium">Page SEO Settings</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the SEO section from the sidebar</li>
                  <li>Select the page you want to optimize</li>
                  <li>Update the following fields:
                    <ul className="list-disc pl-6 mt-2">
                      <li><strong>Meta Title</strong> - The title that appears in search engine results (keep under 60 characters)</li>
                      <li><strong>Meta Description</strong> - A brief summary of the page content (keep under 160 characters)</li>
                      <li><strong>Keywords</strong> - Relevant keywords for the page, separated by commas</li>
                    </ul>
                  </li>
                  <li>Click "Save SEO Settings" to apply your changes</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-6">SEO Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use unique meta titles and descriptions for each page</li>
                  <li>Include relevant keywords naturally in your meta content</li>
                  <li>Keep meta titles under 60 characters to avoid truncation in search results</li>
                  <li>Keep meta descriptions under 160 characters and make them compelling to increase click-through rates</li>
                  <li>Focus on describing your products and services accurately</li>
                </ul>
                
                <p className="text-sm text-gray-500 mt-4">
                  Note: SEO changes may take time to affect your search engine rankings. Be patient and monitor results over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-10 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-800 mb-3">Need Further Assistance?</h2>
        <p className="text-blue-700 mb-4">
          If you encounter any issues or have questions about using the admin panel that aren't covered in this manual, 
          please contact our technical support team.
        </p>
        <div className="text-blue-700">
          <p><strong>Email:</strong> support@bagprint.ee</p>
          <p><strong>Phone:</strong> +372 123 4567</p>
        </div>
      </div>
    </div>
  );
};

export default AdminManual;
