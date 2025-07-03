import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  read_time: string;
  image_url: string;
  created_at: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

const fetchBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: blogPost, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPost(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('et-EE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogPost?.title,
          text: blogPost?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link kopeeritud",
        description: "Artikli link on kopeeritud lõikelauale"
      });
    }
  };

  // Convert markdown-like formatting to HTML
  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.*)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*)$/gm, '<li class="ml-4">$2</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, '</p>')
      .replace(/<li class="ml-4">(.*?)<\/li>/g, (match, content) => {
        return match.replace(/<\/?p[^>]*>/g, '');
      });
  };

  useEffect(() => {
    if (blogPost) {
      document.title = blogPost.seo_title || blogPost.title;
      // Description
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = blogPost.seo_description || blogPost.excerpt || "";
      // Keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = blogPost.seo_keywords || "";
      // Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = blogPost.seo_title || blogPost.title;
      let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.content = blogPost.seo_description || blogPost.excerpt || "";
    }
  }, [blogPost]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Artiklit ei leitud</h2>
          <p className="text-gray-600 mb-8">Kahjuks ei õnnestunud seda artiklit leida.</p>
          <Link to="/blogi">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tagasi blogisse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Enhanced Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb />
        </div>
        
        {/* Back Button */}
        <Link to="/blogi" className="inline-flex items-center text-gray-600 hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tagasi blogisse
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {blogPost.image_url && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img 
                src={blogPost.image_url}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            {/* Meta Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(blogPost.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{blogPost.read_time} lugemist</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 size={16} />
                Jaga
              </Button>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{blogPost.title}</h1>

            {/* Excerpt */}
            <div className="text-lg text-gray-600 mb-8 font-medium leading-relaxed">
              {blogPost.excerpt}
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(blogPost.content) }}
            />
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-primary text-white py-12 px-8 rounded-lg mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Küsimusi artikli kohta?</h2>
          <h3 className="text-xl font-medium mb-6">Võtke meiega ühendust!</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div>
              <div className="text-lg font-semibold">+372 5919 7172</div>
              <div className="text-sm opacity-90">Ootame kõnet tööpäeviti 9.00-17.00</div>
            </div>
            <Button variant="secondary">
              Võta ühendust
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPost;
