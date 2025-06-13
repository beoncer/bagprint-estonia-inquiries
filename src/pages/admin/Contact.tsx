import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const ContactAdmin: React.FC = () => {
  const [header, setHeader] = useState("Võta meiega ühendust");
  const [headerHighlight, setHeaderHighlight] = useState("ühendust");
  const [description, setDescription] = useState("Kui sul on küsimusi meie toodete, hindade või muu kohta, siis võta meiega ühendust ja aitame sind parima meelega.");
  const [email, setEmail] = useState("info@bagprint.ee");
  const [phone, setPhone] = useState("+372 5919 7172");
  const [address, setAddress] = useState("Laki 7b, Tallinn");
  const [formTitle, setFormTitle] = useState("Saada meile sõnum");
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.6900409549314!2d24.74201731570651!3d59.43438281057916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692949d640b7d95%3A0x52162063ef2cee9!2sLaki%207b%2C%2010114%20Tallinn!5e0!3m2!1sen!2see!4v1652345678901!5m2!1sen!2see");
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setContentLoading(true);
      const { data } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "contact");
      if (data) {
        setHeader(data.find((row: any) => row.key === "contact_header")?.value || "Võta meiega ühendust");
        setHeaderHighlight(data.find((row: any) => row.key === "contact_header_highlight")?.value || "ühendust");
        setDescription(data.find((row: any) => row.key === "contact_description")?.value || "Kui sul on küsimusi meie toodete, hindade või muu kohta, siis võta meiega ühendust ja aitame sind parima meelega.");
        setEmail(data.find((row: any) => row.key === "contact_email")?.value || "info@bagprint.ee");
        setPhone(data.find((row: any) => row.key === "contact_phone")?.value || "+372 5919 7172");
        setAddress(data.find((row: any) => row.key === "contact_address")?.value || "Laki 7b, Tallinn");
        setFormTitle(data.find((row: any) => row.key === "contact_form_title")?.value || "Saada meile sõnum");
        setMapUrl(data.find((row: any) => row.key === "contact_map_url")?.value || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.6900409549314!2d24.74201731570651!3d59.43438281057916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692949d640b7d95%3A0x52162063ef2cee9!2sLaki%207b%2C%2010114%20Tallinn!5e0!3m2!1sen!2see!4v1652345678901!5m2!1sen!2see");
      }
      setContentLoading(false);
    };
    fetchContent();
  }, []);

  const handleContentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSaving(true);
    setContentSuccess(false);
    const updates = [
      { page: "contact", key: "contact_header", value: header },
      { page: "contact", key: "contact_header_highlight", value: headerHighlight },
      { page: "contact", key: "contact_description", value: description },
      { page: "contact", key: "contact_email", value: email },
      { page: "contact", key: "contact_phone", value: phone },
      { page: "contact", key: "contact_address", value: address },
      { page: "contact", key: "contact_form_title", value: formTitle },
      { page: "contact", key: "contact_map_url", value: mapUrl },
    ];
    const { error } = await supabase.from("website_content").upsert(updates, { onConflict: "page,key" });
    setContentSaving(false);
    if (!error) {
      setContentSuccess(true);
      toast({
        title: "Success",
        description: "Contact page content updated successfully"
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to save content: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kontakt</h1>
      </div>

      {/* Dynamic content admin UI */}
      <form className="space-y-8 max-w-2xl mb-10" onSubmit={handleContentSave}>
        <h2 className="text-2xl font-bold mb-2">Kontakti lehe sisu</h2>
        <div>
          <label className="block font-medium mb-1">Pealkiri (header)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Võta meiega ühendust"
            value={header}
            onChange={e => setHeader(e.target.value)}
            disabled={contentLoading || contentSaving}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tõsta esile sõna (highlight word)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="ühendust"
            value={headerHighlight}
            onChange={e => setHeaderHighlight(e.target.value)}
            disabled={contentLoading || contentSaving}
          />
          <p className="text-sm text-gray-500 mt-1">Sisesta sõna, mida soovid pealkirjas punase värviga esile tõsta</p>
        </div>
        <div>
          <label className="block font-medium mb-1">Kirjeldus (description)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Kui sul on küsimusi meie toodete, hindade või muu kohta, siis võta meiega ühendust ja aitame sind parima meelega."
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={contentLoading || contentSaving}
          />
        </div>
        
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Kontaktandmed</h3>
          <div className="mb-2">
            <label className="block font-medium mb-1">E-post</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="info@bagprint.ee"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Telefon</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="+372 5919 7172"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Aadress</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Laki 7b, Tallinn"
              value={address}
              onChange={e => setAddress(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
        </div>

        {/* Form Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Vorm</h3>
          <div>
            <label className="block font-medium mb-1">Vormi pealkiri</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Saada meile sõnum"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
          </div>
        </div>

        {/* Map Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Kaart</h3>
          <div>
            <label className="block font-medium mb-1">Google Maps iframe URL</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="https://www.google.com/maps/embed?..."
              rows={3}
              value={mapUrl}
              onChange={e => setMapUrl(e.target.value)}
              disabled={contentLoading || contentSaving}
            />
            <p className="text-sm text-gray-500 mt-1">Sisesta Google Maps iframe URL. Saad selle Google Maps'ist "Jaga" nupu alt.</p>
          </div>
        </div>

        <Button type="submit" disabled={contentLoading || contentSaving}>
          {contentSaving ? "Salvestan..." : "Salvesta sisu"}
        </Button>
        {contentSuccess && <div className="text-green-600 mt-2">Salvestatud!</div>}
      </form>
    </div>
  );
};

export default ContactAdmin; 