
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface InquiryFormProps {
  productId?: string;
  productName?: string;
}

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
  product: z.string().min(1, {
    message: "Palun valige toode.",
  }),
  quantity: z.string().min(1, {
    message: "Palun valige kogus.",
  }),
  printRequired: z.string(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const InquiryForm = ({ productId, productName }: InquiryFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy product list - this will be fetched from the backend in the real implementation
  const productOptions = [
    { id: "cotton1", name: "Standard puuvillakott" },
    { id: "cotton2", name: "Premium puuvillakott" },
    { id: "paper1", name: "Paberkott - väike" },
    { id: "paper2", name: "Paberkott - suur" },
    { id: "drawstring1", name: "Paelaga kott" },
    { id: "box1", name: "E-poe karp - väike" },
    { id: "box2", name: "E-poe karp - keskmine" },
    { id: "box3", name: "E-poe karp - suur" },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      product: productId || "",
      quantity: "",
      printRequired: "no",
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
        title: "Päring saadetud!",
        description: "Võtame teiega peagi ühendust.",
      });
      form.reset();
    }, 1000);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Pakkumise küsimine</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Nimi *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Teie nimi" 
                      className="h-10 md:h-11 text-sm md:text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">E-post *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="teie@email.ee" 
                      className="h-10 md:h-11 text-sm md:text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Telefon *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+372 ..." 
                      className="h-10 md:h-11 text-sm md:text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Toode *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 md:h-11 text-sm md:text-base">
                        <SelectValue placeholder="Valige toode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productOptions.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Kogus *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 md:h-11 text-sm md:text-base">
                        <SelectValue placeholder="Valige kogus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="50">50 tk</SelectItem>
                      <SelectItem value="100">100 tk</SelectItem>
                      <SelectItem value="200">200 tk</SelectItem>
                      <SelectItem value="500">500 tk</SelectItem>
                      <SelectItem value="1000">1000 tk</SelectItem>
                      <SelectItem value="custom">Muu kogus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="printRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Kas soovite trükki?</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 md:h-11 text-sm md:text-base">
                        <SelectValue placeholder="Valige" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Jah, soovin trükki</SelectItem>
                      <SelectItem value="no">Ei, ilma trükita</SelectItem>
                      <SelectItem value="undecided">Ei ole veel kindel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Lisainfo</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Siia saate lisada täpsustavat infot (nt trüki detailid, värvid, erikujundus jne)"
                    className="min-h-[100px] md:min-h-[120px] text-sm md:text-base resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 md:h-12 text-sm md:text-base" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saadan..." : "Saada päring"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InquiryForm;
