import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Breadcrumb from "@/components/ui/breadcrumb";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags: string[];
  url?: string;
}

const categories = [
  { label: 'Kõik', value: 'all' },
  { label: 'Veebilehed', value: 'websites' },
  { label: 'E-poed', value: 'ecommerce' },
  { label: 'Bränding', value: 'branding' },
  { label: 'Muu', value: 'other' },
];

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: portfolioContent, isLoading: contentLoading, isError: contentError } = useQuery({
    queryKey: ['portfolio-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_content')
        .select('key, value')
        .eq('page', 'portfolio');

      if (error) {
        console.error('Error fetching portfolio content:', error);
        throw error;
      }

      const content: { [key: string]: string } = {};
      data.forEach((item) => {
        content[item.key] = item.value;
      });
      return content;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setError('Failed to fetch projects. Please try again later.');
          console.error('Error fetching projects:', error);
          return;
        }

        setProjects(data || []);
        setFilteredProjects(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let results = [...projects];

    if (selectedCategory !== 'all') {
      results = results.filter((project) => project.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((project) =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term)
      );
    }

    setFilteredProjects(results);
  }, [searchTerm, selectedCategory, projects]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const getPortfolioContent = (key: string, defaultValue: string = '') => {
    return portfolioContent?.[key] || defaultValue;
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Enhanced Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {getPortfolioContent('portfolio_heading', 'Meie Portfoolio')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getPortfolioContent('portfolio_description', 'Valik meie parimatest töödest. Iga projekt on loodud hoole ja pühendumusega, et saavutada klientide eesmärgid.')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Input
              type="text"
              placeholder="Otsi projekte..."
              className="mr-4"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" /> Otsi
            </Button>
          </div>

          <Select onValueChange={handleCategoryChange} defaultValue={selectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vali kategooria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="text-center">Laen projekte...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="h-56 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags && project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  {project.url && (
                    <Button asChild variant="link" className="mt-4">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">Vaata lähemalt</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
