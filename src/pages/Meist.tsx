import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Globe, Heart, Star, ThumbsUp } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";

const ICON_MAP: Record<string, React.ElementType> = {
  check: CheckCircle,
  user: Users,
  heart: Heart,
  globe: Globe,
  star: Star,
  "thumbs-up": ThumbsUp,
};

const Meist: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [promises, setPromises] = useState<{ icon: string; title: string; text: string }[]>([]);
  const [promisesTitle, setPromisesTitle] = useState("");
  const [promisesSubtitle, setPromisesSubtitle] = useState("");
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaButton, setCtaButton] = useState("");
  const [missionTitle, setMissionTitle] = useState("");
  const [missionTexts, setMissionTexts] = useState<string[]>([]);
  const [headerHighlight, setHeaderHighlight] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("website_content")
        .select("key, value")
        .eq("page", "meist");
      if (data) {
        setHeader(data.find((row: any) => row.key === "meist_header")?.value || "");
        setDescription(data.find((row: any) => row.key === "meist_description")?.value || "");
        setPromisesTitle(data.find((row: any) => row.key === "meist_promises_title")?.value || "");
        setPromisesSubtitle(data.find((row: any) => row.key === "meist_promises_subtitle")?.value || "");
        setCtaTitle(data.find((row: any) => row.key === "meist_cta_title")?.value || "");
        setCtaText(data.find((row: any) => row.key === "meist_cta_text")?.value || "");
        setCtaButton(data.find((row: any) => row.key === "meist_cta_button")?.value || "");
        // Stats
        const statArr = [];
        for (let i = 1; i <= 6; i++) {
          const value = data.find((row: any) => row.key === `meist_stat_${i}_value`)?.value || "";
          const label = data.find((row: any) => row.key === `meist_stat_${i}_label`)?.value || "";
          if (value || label) statArr.push({ value, label });
        }
        setStats(statArr);
        // Promises
        const promiseArr = [];
        for (let i = 1; i <= 6; i++) {
          const icon = data.find((row: any) => row.key === `meist_promise_${i}_icon`)?.value || "check";
          const title = data.find((row: any) => row.key === `meist_promise_${i}_title`)?.value || "";
          const text = data.find((row: any) => row.key === `meist_promise_${i}_text`)?.value || "";
          if (title || text) promiseArr.push({ icon, title, text });
        }
        setPromises(promiseArr);
        setMissionTitle(data.find((row: any) => row.key === "meist_mission_title")?.value || "");
        const missionArr = [];
        for (let i = 1; i <= 3; i++) {
          const text = data.find((row: any) => row.key === `meist_mission_text_${i}`)?.value || "";
          if (text) missionArr.push(text);
        }
        setMissionTexts(missionArr);
        setHeaderHighlight(data.find((row: any) => row.key === "meist_header_highlight")?.value || "");
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading || !header) {
    return <div className="py-32 text-center text-gray-500">Laadimine...</div>;
  }

  // Highlight logic for header
  let headerNode: React.ReactNode = header;
  if (header && headerHighlight) {
    const idx = header.toLowerCase().indexOf(headerHighlight.toLowerCase());
    if (idx !== -1) {
      headerNode = <>
        {header.slice(0, idx)}
        <span className="text-primary">{header.slice(idx, idx + headerHighlight.length)}</span>
        {header.slice(idx + headerHighlight.length)}
      </>;
    }
  }

  // Split header for colored 'lugu'
  const split = header.split(/(lugu)/i);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Add Breadcrumb Navigation */}
        <div className="mb-6 pt-8">
          <Breadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {headerNode}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats.length > 0 && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center bg-white hover:bg-primary transition-colors duration-300">
                    <div className="text-5xl font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 group-hover:text-white text-lg uppercase tracking-wide font-medium transition-colors duration-300">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guarantees Section (Promises) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{promisesTitle}</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {promisesSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promises.map((promise, index) => {
              const IconComponent = ICON_MAP[promise.icon] || CheckCircle;
              return (
                <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                          {promise.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {promise.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section (dynamic) */}
      {missionTitle && missionTexts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{missionTitle}</h2>
                </div>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  {missionTexts.map((text, idx) => (
                    <p key={idx}>{text}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section (dynamic) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {ctaTitle}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {ctaText}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg" asChild>
              <a href="/kontakt">{ctaButton}</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Meist;
