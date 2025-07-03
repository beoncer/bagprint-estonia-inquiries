import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Breadcrumb from "@/components/ui/breadcrumb";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string;
  bio: string;
  order: number;
}

interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AboutContent {
  hero_title: string;
  hero_description: string;
  story_title: string;
  story_content: string;
  mission_title: string;
  mission_content: string;
  values_title: string;
  team_title: string;
  cta_title: string;
  cta_description: string;
  seo_title: string;
  seo_description: string;
}

const Meist = () => {
  const { data: aboutContent, isLoading: contentLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_content')
        .select('key, value')
        .eq('page', 'about');
      
      if (error) throw error;
      
      const content: Partial<AboutContent> = {};
      data?.forEach((item) => {
        content[item.key as keyof AboutContent] = item.value;
      });
      
      return content as AboutContent;
    },
  });

  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const { data: companyValues, isLoading: valuesLoading } = useQuery({
    queryKey: ['company-values'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_values')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) throw error;
      return data as CompanyValue[];
    },
  });

  // Set SEO meta tags
  useEffect(() => {
    if (aboutContent) {
      document.title = aboutContent.seo_title || 'Meist - Leatex';
      
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = aboutContent.seo_description || '';
    }
  }, [aboutContent]);

  const iconMap = {
    'award': Award,
    'users': Users,
    'clock': Clock,
    'check-circle': CheckCircle,
  };

  if (contentLoading) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Enhanced Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {aboutContent?.hero_title || 'Meist'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {aboutContent?.hero_description || 'Tutvuge meie ettevõttega ja meeskonnaga'}
          </p>
        </section>

        {/* Company Story */}
        <section className="mb-20">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">
              {aboutContent?.story_title || 'Meie lugu'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">
                {aboutContent?.story_content || 'Meie ettevõtte lugu...'}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-20">
          <div className="bg-primary text-white rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">
              {aboutContent?.mission_title || 'Meie missioon'}
            </h2>
            <p className="text-xl leading-relaxed whitespace-pre-wrap">
              {aboutContent?.mission_content || 'Meie missioon on...'}
            </p>
          </div>
        </section>

        {/* Company Values */}
        {companyValues && companyValues.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              {aboutContent?.values_title || 'Meie väärtused'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companyValues.map((value) => {
                const IconComponent = iconMap[value.icon as keyof typeof iconMap] || CheckCircle;
                return (
                  <div key={value.id} className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Team Section */}
        {teamMembers && teamMembers.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              {aboutContent?.team_title || 'Meie meeskond'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gray-100 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">
              {aboutContent?.cta_title || 'Valmis alustama?'}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {aboutContent?.cta_description || 'Võtke meiega ühendust ja arutame teie vajadusi'}
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+372 5919 7172</div>
                <div className="text-sm text-gray-600">Ootame kõnet tööpäeviti 9.00-17.00</div>
              </div>
              <Button size="lg" className="px-8">
                Võta ühendust
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Meist;
