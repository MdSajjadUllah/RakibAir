import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Star, Clock, User, Share2, X, Search, Menu, Moon, Sun, 
  ArrowUp, CheckCircle, Mail, MapPin, ExternalLink, 
  Twitter, Instagram, Youtube, Linkedin, Info, Phone, Sparkles, Send, Camera, Image as ImageIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ARTICLES, RANKINGS, PRODUCTS, TIPS } from './constants';
import { Article, Review } from './types';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const articleRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articlesState, setArticlesState] = useState<Article[]>(() => {
    const saved = localStorage.getItem('articles_reviews');
    if (saved) {
      const parsed = JSON.parse(saved);
      return ARTICLES.map(a => {
        const savedArt = parsed.find((p: any) => p.id === a.id);
        return savedArt ? { ...a, reviews: [...(a.reviews || []), ...(savedArt.reviews || [])] } : a;
      });
    }
    return ARTICLES;
  });
  
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  
  // AI Image Generator States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiError, setAiError] = useState('');

  // Share States
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Review Form States
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' });
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Stats for hero
  const [stats, setStats] = useState({ airports: 0, travelers: 0, rating: 0 });

  // Form states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactErrors, setContactErrors] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    // Splash screen
    const timer = setTimeout(() => {
      setLoading(false);
      // Trigger count up animation
      const startStats = () => {
        let a = 0; let t = 0; let r = 0;
        const interval = setInterval(() => {
          if (a < 200) a += 4;
          if (t < 50) t += 1;
          if (r < 4.9) r += 0.1;
          setStats({ airports: a, travelers: t, rating: parseFloat(r.toFixed(1)) });
          if (a >= 200 && t >= 50 && r >= 4.9) clearInterval(interval);
        }, 30);
      };
      startStats();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 300);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredArticles = useMemo(() => {
    return articlesState.filter(article => {
      const matchesCategory = activeCategory === 'All' || article.category + 's' === activeCategory || (article.category === 'Gear Guide' && activeCategory === 'Gear Guides');
      const matchesSearch = article.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                            article.preview.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                            article.tags.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, debouncedSearchQuery, articlesState]);

  const handleOpenArticle = (article: Article) => {
    if (selectedArticle?.id === article.id) return;
    
    const cardElement = articleRefs.current[article.id];
    if (cardElement) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = cardElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // If card not in DOM (e.g. filtered out), scroll to top of articles section first
      scrollToSection('articles');
    }

    // Small delay to allow scroll to start or finish before modal covers view
    setTimeout(() => {
      setSelectedArticle(article);
    }, 100);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSuccess(true);
  };

  const validateContact = () => {
    const errors = { name: '', email: '', subject: '', message: '' };
    let isValid = true;
    if (!contactForm.name) { errors.name = 'Name is required'; isValid = false; }
    if (!contactForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) { errors.email = 'Valid email is required'; isValid = false; }
    if (!contactForm.subject) { errors.subject = 'Subject is required'; isValid = false; }
    if (!contactForm.message) { errors.message = 'Message is required'; isValid = false; }
    setContactErrors(errors);
    return isValid;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContact()) {
      setContactSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError('');
    setGeneratedImage(null);

    try {
      // For a seamless demo experience, we use a real-time AI generation service
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(aiPrompt + " realistic travel photography high quality")}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
      
      // We "pre-load" the image to simulate server-side generation feel
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      console.error(err);
      setAiError('Failed to generate image. Please try a different prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = (type: 'link' | 'email' | 'fb' | 'twitter') => {
    if (!selectedArticle) return;
    const url = window.location.href;
    const text = `Check out this airport sleeping guide: ${selectedArticle.title} via RakibAir`;
    
    switch (type) {
      case 'link':
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
      case 'fb':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !reviewForm.comment || !reviewForm.userName) return;

    setReviewSubmitLoading(true);
    
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        userName: reviewForm.userName,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };

      const updatedArticles = articlesState.map(art => {
        if (art.id === selectedArticle.id) {
          const updatedArt = {
            ...art,
            reviews: [newReview, ...(art.reviews || [])]
          };
          setSelectedArticle(updatedArt);
          return updatedArt;
        }
        return art;
      });

      setArticlesState(updatedArticles);
      
      // Save locally (simple persistence for demo)
      const locallySaved = updatedArticles.map(a => ({ id: a.id, reviews: (a.reviews || []).filter(r => parseInt(r.id) > 100) })); // only save "new" reviews
      localStorage.setItem('articles_reviews', JSON.stringify(locallySaved));

      setReviewForm({ userName: '', rating: 5, comment: '' });
      setReviewSubmitLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-[9999]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Plane className="text-accent w-16 h-16" />
        </motion.div>
        <h1 className="text-white text-4xl font-serif font-bold tracking-tight">RakibAir</h1>
        <p className="text-accent font-accent mt-2">Loading your world of comfort...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-accent selection:text-primary">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[10001] bg-transparent">
        <div 
          className="h-full bg-accent transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Announcement Bar */}
      <div 
        className="bg-accent text-primary text-center py-2 px-4 text-sm font-medium cursor-pointer hover:bg-opacity-90 transition-all"
        onClick={() => {
          const art = ARTICLES.find(a => a.id === 3); // Changi Guide ID
          if (art) handleOpenArticle(art);
          else scrollToSection('articles');
        }}
      >
        ✈ New: Singapore Changi Airport Guide 2026 is live! <span className="underline ml-1">Read now →</span>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-[10000] transition-all duration-300 ${isScrolled ? 'bg-card-bg shadow-lg py-2' : 'bg-card-bg py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center gap-2">
              <Plane className="text-accent w-8 h-8 fill-accent" />
              <span className="text-2xl font-serif font-extrabold tracking-tighter text-primary dark:text-white">RakibAir</span>
            </div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-accent mt-[-4px]">Sleep Smarter. Travel Better.</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Airports A–Z', id: 'articles' },
              { label: 'Tips & Tricks', id: 'tips' },
              { label: 'Lounges', id: 'rankings' },
              { label: 'About', id: 'about' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium hover:text-accent transition-colors relative group text-text-primary dark:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative group">
              <input
                type="text"
                placeholder="Search airports..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-border-custom bg-background-warm text-sm focus:outline-none focus:ring-2 focus:ring-accent w-48 lg:w-64 transition-all"
              />
              <Search className="absolute left-3 w-4 h-4 text-text-muted group-focus-within:text-accent" />
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-accent-light dark:hover:bg-gray-800 transition-colors text-text-primary dark:text-white"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="lg:hidden p-2 text-text-primary dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-card-bg dark:bg-gray-900 border-t border-border-custom dark:border-white/5 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {[
                  { label: 'Home', id: 'hero' },
                  { label: 'Airports A–Z', id: 'articles' },
                  { label: 'Tips & Tricks', id: 'tips' },
                  { label: 'Lounges', id: 'rankings' },
                  { label: 'About', id: 'about' },
                  { label: 'Contact', id: 'contact' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.id)}
                    className="text-lg font-medium text-left hover:text-accent transition-colors text-text-primary dark:text-white"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="relative mt-4">
                  <input
                    type="text"
                    placeholder="Search guide..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-custom bg-background-warm"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2000&auto=format&fit=crop" 
              alt="Background" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-6">
                Sleep Like a Pro,<br />Anywhere in the World
              </h1>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
                Expert guides, honest reviews, and insider tips for sleeping comfortably in 200+ airports worldwide. Don't just travel—arrive refreshed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <button 
                  onClick={() => scrollToSection('articles')}
                  className="bg-accent hover:bg-[#e09115] text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-accent/20"
                >
                  Browse Airport Guides
                </button>
                <button 
                  onClick={() => scrollToSection('tips')}
                  className="bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                >
                  Top Tips for Travelers
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-full text-accent">🌍</div>
                  <div>
                    <div className="text-2xl font-bold">{stats.airports}+</div>
                    <div className="text-sm text-blue-200">Airports Covered</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-full text-accent">✈</div>
                  <div>
                    <div className="text-2xl font-bold">{stats.travelers}K+</div>
                    <div className="text-sm text-blue-200">Monthly Travelers</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-full text-accent">⭐</div>
                  <div>
                    <div className="text-2xl font-bold">{stats.rating}/5</div>
                    <div className="text-sm text-blue-200">User Rating</div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap gap-4 items-center">
                <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">Hot Spots:</span>
                {['Dubai', 'London', 'NYC', 'Tokyo', 'Singapore'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => {setSearchInput(tag); scrollToSection('articles');}}
                    className="px-3 py-1 bg-white/5 hover:bg-white/20 rounded-full text-xs transition-colors border border-white/10"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
          {/* Decorative Plane Path */}
          <div className="absolute top-1/2 right-[-10%] opacity-10 pointer-events-none">
            <Plane size={600} className="text-white" />
          </div>
        </section>

        {/* Article Section */}
        <section id="articles" className="py-24 bg-background-warm dark:bg-black/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-4 dark:text-white">Expert Airport Guides</h2>
                <p className="text-text-secondary dark:text-text-muted">Hand-written by frequent flyers who've spent thousands of nights in terminals.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Airport Guides', 'Travel Tips', 'Lounge Reviews', 'Gear Guides'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                      activeCategory === cat 
                      ? 'bg-accent text-primary shadow-accent/20' 
                      : 'bg-card-bg text-text-secondary hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {debouncedSearchQuery && (
              <div className="mb-8 flex items-center justify-between bg-accent-light dark:bg-accent/10 px-6 py-3 rounded-xl">
                <p className="text-primary dark:text-accent font-medium">
                  {filteredArticles.length} results for "{debouncedSearchQuery}"
                </p>
                <button onClick={() => setSearchInput('')} className="text-primary hover:underline text-sm font-bold flex items-center gap-1">
                  <X size={14} /> Clear Search
                </button>
              </div>
            )}

            {filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-card-bg rounded-3xl border-2 border-dashed border-border-custom">
                <Search size={48} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-2xl font-bold mb-2 dark:text-white">No articles found for "{debouncedSearchQuery}"</h3>
                <p className="text-text-secondary dark:text-text-muted mb-6">Try another keyword or browse our categories instead.</p>
                <button 
                  onClick={() => {setSearchInput(''); setActiveCategory('All')}}
                  className="text-accent font-bold underline"
                >
                  View all articles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, idx) => (
                  <motion.div
                    key={article.id}
                    ref={(el) => articleRefs.current[article.id] = el}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-card-bg dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-border-custom/50 hover:-translate-y-2 relative"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                          {article.category}
                        </span>
                      </div>
                      {article.isPopular && (
                        <div className="absolute top-4 right-4 animate-bounce">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                            🔥 Most Popular
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-1 mb-3 text-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(article.rating) ? "currentColor" : "none"} strokeWidth={1.5} />
                        ))}
                        <span className="text-xs text-text-muted ml-1">({article.rating})</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-accent transition-colors dark:text-white">
                        {article.title}
                      </h3>
                      <p className="text-text-secondary dark:text-text-muted text-sm line-clamp-2 mb-6">
                        {article.preview}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-border-custom dark:border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xs">
                            {article.authorInitials}
                          </div>
                          <div>
                            <p className="text-xs font-bold dark:text-white">{article.author}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-tighter">{article.date}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleOpenArticle(article)}
                          className="text-sm font-bold text-accent flex items-center gap-1 group/btn"
                        >
                          Read More <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Airport Rankings Section */}
        <section id="rankings" className="py-24 bg-white dark:bg-gray-900 border-y border-border-custom dark:border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">World's Top 8 Sleepers' Choice</h2>
              <p className="text-text-secondary dark:text-text-muted max-w-2xl mx-auto">Ranked by comfort, safety, lounge accessibility, and 24-hour service standards.</p>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-border-custom dark:border-white/10">
              <table className="w-full text-left bg-card-bg dark:bg-transparent">
                <thead>
                  <tr className="border-b border-border-custom dark:border-white/10 text-text-muted text-xs uppercase tracking-widest font-accent">
                    <th className="px-6 py-6">Rank</th>
                    <th className="px-6 py-6">Airport Name</th>
                    <th className="px-6 py-6">City</th>
                    <th className="px-6 py-6 text-center">Sleep Score</th>
                    <th className="px-6 py-6 hidden md:table-cell">Lounges</th>
                    <th className="px-6 py-6 hidden lg:table-cell">Access</th>
                    <th className="px-6 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-primary dark:text-white">
                  {RANKINGS.map((entry) => (
                    <tr key={entry.rank} className="border-b last:border-0 border-border-custom/50 dark:border-white/5 hover:bg-background-warm dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          entry.rank === 1 ? 'bg-accent text-primary' : 
                          entry.rank === 2 ? 'bg-gray-200 dark:bg-gray-700' : 
                          entry.rank === 3 ? 'bg-orange-100 dark:bg-orange-900/30' : 
                          'bg-transparent'
                        }`}>
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-bold">{entry.name}</td>
                      <td className="px-6 py-6 text-text-secondary dark:text-text-muted">{entry.city}</td>
                      <td className="px-6 py-6 text-center font-serif text-lg text-accent font-bold">{entry.score}</td>
                      <td className="px-6 py-6 hidden md:table-cell">
                        <span className="px-2 py-1 rounded bg-tag-bg dark:bg-accent/10 text-tag-text dark:text-accent text-[10px] font-bold uppercase">{entry.lounges}</span>
                      </td>
                      <td className="px-6 py-6 hidden lg:table-cell text-sm">{entry.access}</td>
                      <td className="px-6 py-6 text-right">
                        <button 
                          onClick={() => {
                            const art = articlesState.find(a => a.title.includes(entry.name));
                            if(art) handleOpenArticle(art);
                            else { setSearchInput(entry.name); scrollToSection('articles'); }
                          }}
                          className="text-xs font-bold text-text-muted hover:text-accent transition-colors flex items-center justify-end gap-1"
                        >
                          View Guide <ArrowUp size={12} className="rotate-45" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* AI Image Generator Section */}
        <section className="py-24 bg-background-warm dark:bg-black/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-card-bg dark:bg-gray-900 rounded-[3rem] shadow-xl overflow-hidden border border-border-custom dark:border-white/5">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-12">
                  <div className="flex items-center gap-2 mb-6 text-accent">
                    <Sparkles size={24} />
                    <span className="font-bold uppercase tracking-widest text-xs">AI-Powered Experience</span>
                  </div>
                  <h2 className="text-4xl font-bold mb-6 dark:text-white leading-tight">Travel Visual Generator</h2>
                  <p className="text-text-secondary dark:text-text-muted text-lg mb-8 leading-relaxed">
                    Need inspiration for your next layover? Generate a custom airport-themed visual for your travel plans or profile. Our AI creates unique imagery based on your imagination.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea 
                        className="w-full px-5 py-4 rounded-2xl border border-border-custom dark:border-white/10 bg-background-warm dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none dark:text-white min-h-[120px]"
                        placeholder="e.g., A cozy sleeping pod in a futuristic airport terminal with neon lights and a starry view"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      ></textarea>
                    </div>
                    {aiError && <p className="text-red-500 text-sm font-medium">{aiError}</p>}
                    <button 
                      onClick={handleGenerateImage}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                        isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent text-primary hover:scale-[1.02] shadow-lg shadow-accent/20'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                          Visualizing...
                        </>
                      ) : (
                        <>
                          <ImageIcon size={20} />
                          Generate My Visual
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-4 text-xs text-text-muted font-accent uppercase tracking-wider">
                    <span>Powered by Gemini AI</span>
                    <span className="h-1 w-1 bg-text-muted rounded-full"></span>
                    <span>Free for our community</span>
                  </div>
                </div>
                
                <div className="lg:w-1/2 bg-gray-50 dark:bg-gray-800/50 p-12 flex items-center justify-center border-l border-border-custom dark:border-white/5 min-h-[400px]">
                  {generatedImage ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative group w-full max-w-sm"
                    >
                      <img 
                        src={generatedImage} 
                        alt="Generated travel visual" 
                        className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700" 
                        referrerPolicy="no-referrer"
                      />
                      <a 
                        href={generatedImage} 
                        download="rakibair-visual.png"
                        className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 text-primary dark:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Download Image"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </motion.div>
                  ) : (
                    <div className="text-center max-w-xs">
                      <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                        <Camera size={40} strokeWidth={1.5} />
                      </div>
                      <h4 className="text-xl font-bold mb-3 dark:text-white">Your Masterpiece Awaits</h4>
                      <p className="text-text-muted text-sm leading-relaxed">
                        Describe the travel vibe you're looking for, and we'll bring it to life in seconds.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section id="tips" className="py-24 bg-background-warm dark:bg-black/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-0.5 w-12 bg-accent"></div>
              <h2 className="text-3xl font-bold dark:text-white">Pro Tips & Tricks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TIPS.map(tip => (
                <motion.div
                  key={tip.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card-bg dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-border-custom dark:border-white/5"
                >
                  <div className="text-5xl mb-6">{tip.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 dark:text-white">{tip.title}</h3>
                  <p className="text-text-secondary dark:text-text-muted leading-relaxed">
                    {tip.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Affiliate Products */}
        <section id="products" className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">Our Top Recommended Travel Gear</h2>
              <p className="text-text-secondary dark:text-text-muted">Hand-tested by frequent flyers. These are the products we actually use to survive long layovers.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRODUCTS.map(product => (
                <div key={product.id} className="group flex flex-col">
                  <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-background-warm dark:bg-white/5">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent font-bold">{product.stars}</span>
                    <span className="text-primary dark:text-white font-serif text-lg font-bold">{product.price}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{product.name}</h3>
                  <p className="text-text-secondary dark:text-text-muted text-sm mb-6 flex-grow">{product.description}</p>
                  <a 
                    href="https://amazon.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 text-center border-2 border-border-custom dark:border-white/10 rounded-xl font-bold text-sm hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                  >
                    View on Amazon <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-primary text-white overflow-hidden relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h2 className="text-4xl font-bold mb-4">Never Miss an Airport Guide</h2>
                <p className="text-blue-200 text-lg">Join 42,000+ travelers who get our weekly airport sleeping tips and latest terminal updates.</p>
              </div>
              <div className="lg:w-1/2 w-full max-w-md">
                {!newsletterSuccess ? (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                    <div className="flex p-2 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-grow bg-transparent border-none outline-none px-4 text-white placeholder:text-blue-200/50"
                      />
                      <button className="bg-accent text-primary px-6 py-3 rounded-xl font-bold transition-all hover:scale-105">
                        Subscribe Free
                      </button>
                    </div>
                    {newsletterError && <span className="text-red-400 text-xs px-4">{newsletterError}</span>}
                  </form>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-success-custom/20 border border-success-custom text-white p-6 rounded-2xl flex items-center gap-4"
                  >
                    <CheckCircle className="text-success-custom flex-shrink-0" size={32} />
                    <div>
                      <h4 className="font-bold">You're subscribed!</h4>
                      <p className="text-sm">Check your inbox for a welcome gift.</p>
                      <button disabled className="mt-4 bg-success-custom text-white px-6 py-2 rounded-lg font-bold opacity-50">
                        Subscribed ✓
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          {/* Background decorations */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
                  <img src="https://picsum.photos/800/1000?grayscale" alt="Travelers" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-accent p-10 rounded-[2.5rem] hidden md:block">
                  <p className="text-primary font-bold text-4xl font-serif">10+</p>
                  <p className="text-primary/70 text-sm font-bold uppercase tracking-widest">Years of Expertise</p>
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-bold mb-8 dark:text-white">Our Story</h2>
                <div className="space-y-6 text-text-secondary dark:text-text-muted text-lg leading-relaxed">
                  <p>
                    RakibAir was founded by a group of frequent travelers who were tired of spending uncomfortable nights on metal benches and shivering under terminal air conditioning. 
                  </p>
                  <p>
                    What started as a shared spreadsheet of "Best Hidden Corners" has grown into the world's most trusted encyclopedia for airport sleepers. We've personally tested thousands of lounge chairs, slept in nearly 200 airports, and talked to airport security staff worldwide to bring you the truth.
                  </p>
                  <p>
                    Our mission is simple: to ensure that every traveler, regardless of their budget, can find a moment of peace and a few hours of sleep during their journey.
                  </p>
                </div>
                <div className="flex gap-8 mt-12">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-accent-light dark:bg-accent/10 flex items-center justify-center text-accent">
                      <Star fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">Authoritative</p>
                      <p className="text-sm dark:text-gray-400">Verified reviews only</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-tag-bg dark:bg-tag-bg/10 flex items-center justify-center text-tag-text">
                      <Plane fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">Global</p>
                      <p className="text-sm dark:text-gray-400">200+ Hubs covered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-background-warm dark:bg-black/20">
          <div className="container mx-auto px-4">
            <div className="bg-card-bg dark:bg-gray-900 rounded-[3rem] shadow-xl overflow-hidden border border-border-custom dark:border-white/5">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 bg-primary p-12 text-white">
                  <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-blue-200 mb-12">Have a hidden sleeping spot to share? Or a correction for one of our guides? We'd love to hear from you.</p>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                        <Mail />
                      </div>
                      <div>
                        <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Email Us</p>
                        <p className="font-medium">support@rakibair.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                        <Phone />
                      </div>
                      <div>
                        <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Call Support</p>
                        <p className="font-medium">+1 (555) RAKIB-AIR</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                        <MapPin />
                      </div>
                      <div>
                        <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Headquarters</p>
                        <p className="font-medium">101 Aviation Way, Dhaka, BD</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 pt-12 border-t border-white/10">
                    <div className="flex gap-4">
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors"><Twitter size={18}/></button>
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors"><Instagram size={18}/></button>
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent transition-colors"><Youtube size={18}/></button>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-3/5 p-12">
                  {!contactSuccess ? (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold dark:text-white">Your Name</label>
                          <input 
                            type="text" 
                            className={`w-full px-5 py-4 rounded-xl border ${contactErrors.name ? 'border-red-500' : 'border-border-custom dark:border-white/10'} bg-background-warm dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none dark:text-white`}
                            placeholder="John Doe"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          />
                          {contactErrors.name && <p className="text-red-500 text-xs">{contactErrors.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold dark:text-white">Email Address</label>
                          <input 
                            type="email" 
                            className={`w-full px-5 py-4 rounded-xl border ${contactErrors.email ? 'border-red-500' : 'border-border-custom dark:border-white/10'} bg-background-warm dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none dark:text-white`}
                            placeholder="john@example.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          />
                          {contactErrors.email && <p className="text-red-500 text-xs">{contactErrors.email}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold dark:text-white">Subject</label>
                        <input 
                          type="text" 
                          className={`w-full px-5 py-4 rounded-xl border ${contactErrors.subject ? 'border-red-500' : 'border-border-custom dark:border-white/10'} bg-background-warm dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none dark:text-white`}
                          placeholder="How can we help?"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        />
                        {contactErrors.subject && <p className="text-red-500 text-xs">{contactErrors.subject}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold dark:text-white">Your Message</label>
                        <textarea 
                          rows={5}
                          className={`w-full px-5 py-4 rounded-xl border ${contactErrors.message ? 'border-red-500' : 'border-border-custom dark:border-white/10'} bg-background-warm dark:bg-white/5 focus:ring-2 focus:ring-accent outline-none dark:text-white`}
                          placeholder="Tell us more about your experience..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        ></textarea>
                        {contactErrors.message && <p className="text-red-500 text-xs">{contactErrors.message}</p>}
                      </div>
                      <button className="bg-accent text-primary px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-accent/20">
                        Send Message
                      </button>
                    </form>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center p-12"
                    >
                      <div className="w-24 h-24 bg-success-custom/20 rounded-full flex items-center justify-center text-success-custom mb-6">
                        <CheckCircle size={48} />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 dark:text-white">Message Sent!</h3>
                      <p className="text-text-secondary dark:text-text-muted">✅ We've received your inquiry and we'll reply within 24 hours.</p>
                      <button 
                        onClick={() => setContactSuccess(false)}
                        className="mt-8 text-accent font-bold"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary pt-24 pb-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="text-accent w-8 h-8 fill-accent" />
                <span className="text-2xl font-serif font-extrabold tracking-tighter">RakibAir</span>
              </div>
              <p className="text-blue-200/70 mb-8 leading-relaxed">
                The world's most trusted community manual for airport sleepers. Helping you find comfort in the chaos since 2016.
              </p>
              <div className="flex gap-4">
                <button className="p-2 bg-white/5 rounded-lg hover:bg-accent transition-colors"><Twitter size={18} /></button>
                <button className="p-2 bg-white/5 rounded-lg hover:bg-accent transition-colors"><Instagram size={18} /></button>
                <button className="p-2 bg-white/5 rounded-lg hover:bg-accent transition-colors"><Youtube size={18} /></button>
                <button className="p-2 bg-white/5 rounded-lg hover:bg-accent transition-colors"><Linkedin size={18} /></button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-blue-200/50">
                {[
                  { label: 'Home', id: 'hero' },
                  { label: 'Airports A–Z', id: 'articles' },
                  { label: 'Tips & Tricks', id: 'tips' },
                  { label: 'Lounges', id: 'rankings' },
                  { label: 'About', id: 'about' },
                  { label: 'Contact', id: 'contact' }
                ].map(link => (
                  <li key={link.label}>
                    <button 
                      onClick={() => scrollToSection(link.id)}
                      className="hover:text-accent transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Popular Airports</h4>
              <ul className="space-y-4 text-blue-200/50">
                {['Singapore Changi', 'Tokyo Haneda', 'London Heathrow', 'Dubai Int\'l', 'JFK New York', 'Seoul Incheon'].map(name => (
                  <li key={name}>
                    <button 
                      onClick={() => {
                        const art = ARTICLES.find(a => a.title.includes(name));
                        if(art) handleOpenArticle(art);
                        else { setSearchInput(name); scrollToSection('articles'); }
                      }}
                      className="hover:text-accent transition-colors text-left"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Legal & Info</h4>
              <ul className="space-y-4 text-blue-200/50">
                <li><button className="hover:text-accent font-accent text-sm">Privacy Policy</button></li>
                <li><button className="hover:text-accent font-accent text-sm">Terms of Service</button></li>
                <li><button className="hover:text-accent font-accent text-sm">Cookie Settings</button></li>
                <li><button className="hover:text-accent font-accent text-sm">Affiliate Disclosure</button></li>
                <li><button className="hover:text-accent font-accent text-sm">Sitemap</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-blue-400/50 text-xs font-accent tracking-wider">
            <p>© 2026 RakibAir Media. Not affiliated with any airport authority. Made by Md. Rakibul Hasan.</p>
            <div className="flex gap-8">
              <span>DESIGNED BY MD. RAKIBUL HASAN</span>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-accent underline flex items-center gap-1"
              >
                BACK TO TOP <ArrowUp size={12} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[20000] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-primary/80 backdrop-blur-md" onClick={() => setSelectedArticle(null)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="h-64 sm:h-80 w-full relative">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white text-white hover:text-primary rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                >
                  <X />
                </button>
                <div className="absolute bottom-8 left-8 right-8">
                   <span className="bg-accent text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-4 inline-block">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{selectedArticle.title}</h2>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto p-12 custom-scrollbar">
                <div className="flex flex-wrap items-center justify-between mb-10 pb-6 border-b border-border-custom dark:border-white/10 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                      {selectedArticle.authorInitials}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{selectedArticle.author}</p>
                      <p className="text-xs text-text-muted">{selectedArticle.date} • {selectedArticle.readTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 relative">
                    <div className="relative">
                      <button 
                        onClick={() => setIsShareOpen(!isShareOpen)}
                        className={`flex items-center gap-2 bg-background-warm dark:bg-white/5 hover:bg-accent-light dark:hover:bg-accent/20 px-4 py-2 rounded-xl text-sm font-bold transition-all dark:text-white ${isShareOpen ? 'ring-2 ring-accent' : ''}`}
                      >
                        <Share2 size={16} /> Share
                      </button>
                      
                      <AnimatePresence>
                        {isShareOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-border-custom dark:border-white/10 p-2 min-w-[200px] z-[20002]"
                          >
                            <div className="grid grid-cols-1 gap-1">
                              <button 
                                onClick={() => handleShare('link')}
                                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-background-warm dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium dark:text-white"
                              >
                                {copySuccess ? <CheckCircle size={16} className="text-green-500" /> : <ExternalLink size={16} className="text-accent" />}
                                {copySuccess ? 'Copied!' : 'Copy Link'}
                              </button>
                              <button 
                                onClick={() => handleShare('twitter')}
                                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-background-warm dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium dark:text-white"
                              >
                                <Twitter size={16} className="text-blue-400" />
                                Share on Twitter
                              </button>
                              <button 
                                onClick={() => handleShare('fb')}
                                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-background-warm dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium dark:text-white"
                              >
                                <Youtube size={16} className="text-blue-700" /> {/* Using Youtube icon as a placeholder for FB if Lucide Facebook is missing or just grouped */}
                                Share on Facebook
                              </button>
                              <button 
                                onClick={() => handleShare('email')}
                                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-background-warm dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium dark:text-white"
                              >
                                <Mail size={16} className="text-red-400" />
                                Share via Email
                              </button>
                            </div>
                            <div className="absolute top-full left-6 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-border-custom dark:border-white/10 rotate-45 -translate-y-1.5"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button 
                      onClick={() => setSelectedArticle(null)}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-opacity-90 transition-all"
                    >
                      ← Back to Articles
                    </button>
                  </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                  {selectedArticle.content.map((p, i) => (
                    <p key={i} className="text-text-secondary dark:text-text-muted leading-relaxed text-lg">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-border-custom dark:border-white/10">
                  <h3 className="text-2xl font-bold mb-8 dark:text-white">Traveler Reviews</h3>
                  
                  {/* Review Form */}
                  <div className="bg-background-warm dark:bg-white/5 rounded-3xl p-8 mb-12">
                    <h4 className="text-lg font-bold mb-6 dark:text-white">Share Your Experience</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          className="w-full px-4 py-3 rounded-xl border border-border-custom dark:border-white/10 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent dark:text-white text-sm"
                          value={reviewForm.userName}
                          onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                          required
                        />
                        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-border-custom dark:border-white/10">
                          <span className="text-xs font-bold text-text-muted uppercase">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button 
                                key={num}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                                className="text-accent"
                              >
                                <Star size={16} fill={num <= reviewForm.rating ? "currentColor" : "none"} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <textarea 
                        placeholder="Tell others about your sleeping experience at this airport..."
                        className="w-full px-4 py-3 rounded-xl border border-border-custom dark:border-white/10 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent dark:text-white text-sm min-h-[100px]"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                      ></textarea>
                      <button 
                        type="submit"
                        disabled={reviewSubmitLoading}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-2"
                      >
                        {reviewSubmitLoading ? "Submitting..." : <><Send size={16} /> Submit Review</>}
                      </button>
                    </form>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {selectedArticle.reviews && selectedArticle.reviews.length > 0 ? (
                      selectedArticle.reviews.map((review, i) => (
                        <motion.div 
                          key={review.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 p-6 rounded-2xl border border-border-custom dark:border-white/5"
                        >
                          <div className="w-12 h-12 rounded-full bg-accent-light dark:bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold dark:text-white">{review.userName}</h5>
                              <span className="text-[10px] text-text-muted uppercase font-accent">{review.date}</span>
                            </div>
                            <div className="flex gap-1 mb-3 text-accent">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <p className="text-text-secondary dark:text-text-muted text-sm leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-background-warm dark:bg-white/5 rounded-3xl border border-dashed border-border-custom dark:border-white/10">
                        <Info className="mx-auto text-text-muted mb-4" />
                        <p className="text-text-secondary dark:text-text-muted">No reviews yet. Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border-custom dark:border-white/10">
                  <h4 className="text-sm font-bold mb-4 uppercase tracking-wider dark:text-white">Related Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-tag-bg dark:bg-accent/10 text-tag-text dark:text-accent rounded-full text-xs font-bold">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-6 right-6 lg:left-auto lg:w-[450px] z-[15000]"
          >
            <div className="bg-primary text-white p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-6 border border-white/10 backdrop-blur-md">
              <div className="flex-grow">
                <p className="text-xs text-blue-200">We use cookies to improve your experience and analyze traffic to make airport sleeping better for everyone.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setShowCookieBanner(false)}
                  className="px-4 py-2 text-xs font-bold hover:text-accent transition-colors"
                >
                  Decline
                </button>
                <button 
                  onClick={() => setShowCookieBanner(false)}
                  className="px-5 py-2 bg-accent text-primary rounded-xl text-xs font-bold hover:scale-105 transition-all"
                >
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-[14000] w-12 h-12 bg-accent text-primary rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <ArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

