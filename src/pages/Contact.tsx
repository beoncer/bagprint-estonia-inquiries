import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Breadcrumb from "@/components/ui/breadcrumb";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nimi peab olema vähemalt 2 tähemärki pikk.",
  }),
  email: z.string().email({
    message: "Palun sisestage korrektne e-posti aadress.",
  }),
  phone: z.string().min(5, {
    message: "Palun sisestage korrektne telefoninumber.",
  }),
  message: z.string().min(10, {
    message: "Sõnum peab olema vähemalt 10 tähemärki pikk.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic content state
  const [header, setHeader] = useState("");
  const [headerHighlight, setHeaderHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Fetch dynamic content
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "contact");
      if (data) {
        setHeader(data.find((row: any) => row.key === "contact_header")?.value || "");
        setHeaderHighlight(data.find((row: any) => row.key === "contact_header_highlight")?.value || "");
        setDescription(data.find((row: any) => row.key === "contact_description")?.value || "");
        setEmail(data.find((row: any) => row.key === "contact_email")?.value || "");
        setPhone(data.find((row: any) => row.key === "contact_phone")?.value || "");
        setAddress(data.find((row: any) => row.key === "contact_address")?.value || "");
        setFormTitle(data.find((row: any) => row.key === "contact_form_title")?.value || "");
        setMapUrl(data.find((row: any) => row.key === "contact_map_url")?.value || "");
      }
    };
    fetchContent();
  }, []);
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // In a real implementation, this would send data to a backend API
    // Here we're just simulating a network request
    setTimeout(() => {
      console.log("Form values:", values);
      setIsSubmitting(false);
      toast({
        title: "Sõnum saadetud!",
        description: "Täname teiega ühenduse võtmise eest. Vastame teile peagi.",
      });
      form.reset();
    }, 1000);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Add breadcrumb navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb />
      </div>

      {/* Hero Section - matching portfolio style */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 break-words">
              {headerHighlight && header.includes(headerHighlight) ? (
                <>
                  {header.split(headerHighlight)[0]}
                  <span className="text-primary">{headerHighlight}</span>
                  {header.split(headerHighlight)[1]}
                </>
              ) : header}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 break-words">
              {description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">E-post</h3>
                <p className="text-gray-600 break-words">{email}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Telefon</h3>
                <p className="text-gray-600 break-words">{phone}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Aadress</h3>
                <p className="text-gray-600 break-words">{address}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold mb-6 break-words">{formTitle}</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nimi *</FormLabel>
                        <FormControl>
                          <Input placeholder="Teie nimi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-post *</FormLabel>
                        <FormControl>
                          <Input placeholder="teie@email.ee" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon *</FormLabel>
                      <FormControl>
                        <Input placeholder="+372 ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sõnum *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Kuidas saame teid aidata?"
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saadan..." : "Saada sõnum"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      {mapUrl && (
        <div className="w-full overflow-hidden">
          <div className="h-[300px] md:h-[400px] bg-gray-200 w-full">
            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="leatex.ee location"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
