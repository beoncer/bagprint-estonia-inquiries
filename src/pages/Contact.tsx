import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Breadcrumb from "@/components/ui/breadcrumb";

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
}

const fetchContactInfo = async (): Promise<ContactInfo | null> => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .single();

  if (error) {
    console.error("Error fetching contact info:", error);
    return null;
  }

  return data;
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: contactInfo, isLoading, error } = useQuery({
    queryKey: ['contact-info'],
    queryFn: fetchContactInfo,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      toast({
        title: "Viga",
        description: "Palun täida kõik väljad."
      });
      return;
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone,
          message,
        },
      ]);

    if (error) {
      toast({
        title: "Viga",
        description: "Sõnumi saatmine ebaõnnestus. Palun proovi uuesti."
      });
    } else {
      toast({
        title: "Saadetud!",
        description: "Sõnum on saadetud. Võtame sinuga peagi ühendust."
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }
  };

  useEffect(() => {
    document.title = "Kontakt - Leatex";
    // Description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Võta meiega ühendust! Vastame Sinu küsimustele esimesel võimalusel.";
    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = "";
    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = "Kontakt - Leatex";
    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = "Võta meiega ühendust! Vastame Sinu küsimustele esimesel võimalusel.";
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Enhanced Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Saada meile sõnum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nimi</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Sinu nimi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Sinu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="Sinu telefoninumber"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Sõnum</Label>
                  <Textarea
                    id="message"
                    placeholder="Kirjuta oma sõnum siia..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Saada sõnum
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Kontaktinfo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-gray-500">Laen kontaktinfot...</div>
              ) : error ? (
                <div className="text-red-500">Viga kontaktinfo laadimisel.</div>
              ) : contactInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700">{contactInfo.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <a href={`tel:${contactInfo.phone}`} className="text-blue-500 hover:underline">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <a href={`mailto:${contactInfo.email}`} className="text-blue-500 hover:underline">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700">
                      Avatud: {contactInfo.opening_hours}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Kontaktinfot pole saadaval.</div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Contact;
