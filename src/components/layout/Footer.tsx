
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FooterContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
  order: number;
  visible: boolean;
}

const Footer: React.FC = () => {
  const location = useLocation();
  const [items, setItems] = useState<FooterContentItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("footer_content")
        .select("id, section, key, value, order, visible")
        .eq("visible", true)
        .order("section", { ascending: true })
        .order("order", { ascending: true });
      if (!error && data) setItems(data);
    };
    fetchItems();
  }, []);

  // Group items by section
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, FooterContentItem[]>);

  // Helper to get value by key in a section
  const getValue = (section: string, key: string) =>
    grouped[section]?.find((i) => i.key === key)?.value || "";

  // Helper to get all items with a key in a section
  const getAll = (section: string, key: string) =>
    grouped[section]?.filter((i) => i.key === key) || [];

  // Kiirlingid links: parse JSON value for label+url
  const kiirlingidLinks = (grouped["kiirlingid"] || [])
    .filter(i => i.key === "link_label")
    .map(i => {
      try {
        const obj = JSON.parse(i.value);
        return { label: obj.label, url: obj.url };
      } catch {
        return { label: i.value, url: "" };
      }
    });

  // Tootekategooriad links: parse JSON value for label+url
  const tootekaLinks = (grouped["tootekategooriad"] || [])
    .filter(i => i.key === "link_label")
    .map(i => {
      try {
        const obj = JSON.parse(i.value);
        return { label: obj.label, url: obj.url };
      } catch {
        return { label: i.value, url: "" };
      }
    });

  // Kontakt info: label+value pairs
  const kontaktInfo = (grouped["kontakt"] || [])
    .filter(i => i.key === "contact_label" || i.key === "contact_value")
    .reduce((acc, item) => {
      if (item.key === "contact_label") {
        acc.push({ label: item.value, value: "" });
      } else if (item.key === "contact_value" && acc.length > 0) {
        acc[acc.length - 1].value = item.value;
      }
      return acc;
    }, [] as { label: string; value: string }[]);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            {getValue("logo", "logo_image_url") ? (
              <img
                src={getValue("logo", "logo_image_url")}
                alt={getValue("logo", "logo_text") || "Leatex"}
                className="mb-4 max-h-16 w-auto"
                style={{ maxWidth: 200 }}
              />
            ) : null}
            <h3 className="text-xl font-bold mb-4">{getValue("logo", "logo_text") || "Leatex"}</h3>
            <p className="text-gray-400 mb-4">
              {getValue("logo", "logo_description") || "Kvaliteetsed kotid ja pakendid kohandatud trükiga."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getValue("kiirlingid", "column_title") || "Kiirlingid"}</h4>
            <ul className="space-y-2">
              {kiirlingidLinks.map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.url} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getValue("tootekategooriad", "column_title") || "Tootekategooriad"}</h4>
            <ul className="space-y-2">
              {tootekaLinks.map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.url} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getValue("kontakt", "column_title") || "Kontakt"}</h4>
            <div className="space-y-3">
              {kontaktInfo.map((info, i) => (
                <div key={i} className="flex items-center space-x-3">
                  {info.label.toLowerCase().includes("tel") || info.label.includes("+") ? <Phone size={16} className="text-primary" /> : null}
                  {info.label.toLowerCase().includes("mail") || info.value.includes("@") ? <Mail size={16} className="text-primary" /> : null}
                  {info.label.toLowerCase().includes("aadress") || info.label.toLowerCase().includes("tallinn") ? <MapPin size={16} className="text-primary" /> : null}
                  <span className="text-gray-400">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {new Date().getFullYear()} {getValue("logo", "logo_text") || "Leatex"}. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
