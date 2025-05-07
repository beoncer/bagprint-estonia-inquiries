
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Pakkumise küsimine</h2>
      
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toode *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kogus *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="printRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kas soovite trükki?</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Valige" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Jah, soovin trükki</SelectItem>
                      <SelectItem value="no">Ei, ilma trükita</SelectItem>
                      <SelectItem value="undecided">Ei ole veel kindel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lisainfo</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Siia saate lisada täpsustavat infot (nt trüki detailid, värvid, erikujundus jne)"
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saadan..." : "Saada päring"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InquiryForm;
