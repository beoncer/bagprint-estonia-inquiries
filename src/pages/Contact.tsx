
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
import { useState } from "react";

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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  
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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - matching portfolio style */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Võta meiega <span className="text-primary">ühendust</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kui sul on küsimusi meie toodete, hindade või muu kohta, siis võta meiega ühendust ja aitame sind parima meelega.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">E-post</h3>
                <p className="text-gray-600">info@bagprint.ee</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Telefon</h3>
                <p className="text-gray-600">+372 123 4567</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Aadress</h3>
                <p className="text-gray-600">Kaupmehe 10, Tallinn</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Saada meile sõnum</h2>
            
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
      <div className="h-[400px] bg-gray-200 w-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.6900409549314!2d24.74201731570651!3d59.43438281057916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692949d640b7d95%3A0x52162063ef2cee9!2sKaupmehe%2010%2C%2010114%20Tallinn!5e0!3m2!1sen!2see!4v1652345678901!5m2!1sen!2see" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="bagprint.ee location"
        />
      </div>
    </div>
  );
};

export default Contact;
