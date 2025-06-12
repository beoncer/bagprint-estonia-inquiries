
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  read_time: string;
  image_url: string;
  created_at: string;
}

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  const { data: blogPosts = [], isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(blogPosts);
    } else {
      const filtered = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, blogPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('et-EE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-96 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Viga</h2>
          <p className="text-red-600 mb-8">Blogposte ei õnnestunud laadida. Palun proovige hiljem uuesti.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - matching portfolio style */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Meie <span className="text-primary">blogi</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kasulikud artiklid ja nõuanded kottide valimise, trükkimise ja kasutamise kohta
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Otsi artikleid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </form>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <p className="mb-6 text-gray-600">Leitud {filteredPosts.length} artiklit</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/blogi/${post.slug}`} className="block">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.read_time} lugemist</span>
                      </div>
                    </div>
                    <Link to={`/blogi/${post.slug}`}>
                      <h2 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <Link to={`/blogi/${post.slug}`}>
                      <Button variant="link" size="sm" className="p-0 text-primary hover:text-primary/80">
                        Loe edasi →
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">Artikleid ei leitud</h3>
            <p className="text-gray-600 mb-6">Proovige muuta otsinguterminit</p>
            <Button onClick={() => setSearchTerm("")}>
              Näita kõiki artikleid
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="bg-primary text-white py-16 px-8 rounded-lg mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Küsimusi artiklite kohta?</h2>
          <h3 className="text-2xl font-medium mb-8">Võtke meiega ühendust!</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <div className="text-xl font-semibold">+372 5919 7172</div>
              <div className="text-sm opacity-90">Ootame kõnet tööpäeviti 9.00-17.00</div>
            </div>
            <Button variant="secondary" size="lg">
              Võta ühendust
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
