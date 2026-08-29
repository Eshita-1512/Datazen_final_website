import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Database, 
  Code, 
  Users, 
  ExternalLink, 
  Video,
  FileText,
  Globe,
  ArrowUp,
  Search,
  Filter,
  ChevronRight,
  X,
  GraduationCap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopographyBackground from "@/components/TopographyBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Resource categories
const categories = [
  "All",
  "College Resources",
  "Tutorials",
  "Datasets", 
  "Tools",
  "Books",
  "Videos",
  "Courses",
  "Research Papers",
  "Competitions"
];

// Resource data
const resources = [
  // College Resources - FY & SY Notes
  {
    id: 101,
    title: "FY Notes (First Year)",
    description: "Curated academic notes, syllabus reference materials, lecture summaries, and foundational engineering subjects for First Year students.",
    category: "College Resources",
    type: "book",
    level: "First Year",
    rating: 4.9,
    url: "https://github.com/DZSomaiya/datazen-academic-resources/tree/main/FY",
    author: "DataZen Team",
    tags: ["FY Notes", "Foundations", "Syllabus", "Engineering", "Somaiya"],
    featured: true,
    dateAdded: "2026-08-29"
  },
  {
    id: 102,
    title: "SY Notes (Second Year)",
    description: "Comprehensive notes, data structures, mathematics, core data science theory, and practical lab assignments for Second Year students.",
    category: "College Resources",
    type: "book",
    level: "Second Year",
    rating: 4.9,
    url: "https://github.com/DZSomaiya/datazen-academic-resources/tree/main/SY",
    author: "DataZen Team",
    tags: ["SY Notes", "Core Subjects", "Data Science", "Labs", "Somaiya"],
    featured: true,
    dateAdded: "2026-08-29"
  },

  // DataZen Added Resources - Priority
  {
    id: 1,
    title: "Machine Learning Visualizer",
    description: "Interactive web application built with Streamlit for visualizing and understanding various machine learning algorithms and concepts.",
    category: "Tools",
    type: "tool",
    level: "Beginner",
    rating: 4.8,
    url: "https://machine-learning-visualizer.streamlit.app/",
    author: "DataZen Community",
    tags: ["Machine Learning", "Visualization", "Interactive", "Educational", "Streamlit"],
    featured: true,
    dateAdded: "2024-10-14"
  },
  {
    id: 2,
    title: "DataZen Books Collection",
    description: "Comprehensive collection of data science and machine learning books curated by DataZen team for enhanced learning.",
    category: "Books",
    type: "book",
    level: "All Levels",
    rating: 4.8,
    url: "https://drive.google.com/drive/folders/1meblX2ZnX5FAWaHv7BbW8bjZLwRvb-OI",
    author: "DataZen Team",
    tags: ["Curated Collection", "Data Science", "Machine Learning", "Reference"],
    featured: true,
    dateAdded: "2024-10-14"
  },
  {
    id: 3,
    title: "Comprehensive Datasets Collection",
    description: "A curated collection of diverse datasets spanning multiple domains including finance, healthcare, social media, and more for machine learning projects.",
    category: "Datasets",
    type: "dataset",
    level: "All Levels",
    rating: 4.6,
    url: "https://github.com/MainakRepositor/Datasets/tree/master",
    author: "MainakRepositor",
    tags: ["Diverse Domains", "Machine Learning", "Finance", "Healthcare", "Social Media"],
    featured: true,
    dateAdded: "2024-10-14"
  },
  {
    id: 4,
    title: "Complete Data Science Course",
    description: "Comprehensive data science playlist covering everything from basics to advanced topics with practical implementations.",
    category: "Videos",
    type: "video",
    level: "All Levels",
    rating: 4.7,
    url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH&si=Z1skDkhGnyZX20iU",
    author: "DataZen Curated",
    tags: ["Complete Course", "Data Science", "Practical", "Comprehensive"],
    featured: true,
    dateAdded: "2024-10-14"
  },

  // Original Resources
  {
    id: 5,
    title: "Complete Python for Data Science",
    description: "A comprehensive guide covering Python fundamentals to advanced data science concepts including pandas, numpy, and scikit-learn.",
    category: "Tutorials",
    type: "tutorial",
    level: "Beginner",
    rating: 4.8,
    url: "https://www.kaggle.com/learn/python",
    author: "Kaggle Learn",
    tags: ["Python", "Pandas", "NumPy", "Data Analysis"],
    featured: true,
    dateAdded: "2024-01-15"
  },
  {
    id: 2,
    title: "Complete Python for Data Science",
    description: "A comprehensive guide covering Python fundamentals to advanced data science concepts including pandas, numpy, and scikit-learn.",
    category: "Tutorials",
    type: "tutorial",
    level: "Beginner",
    rating: 4.8,
    url: "https://www.kaggle.com/learn/python",
    author: "Kaggle Learn",
    tags: ["Python", "Pandas", "NumPy", "Data Analysis"],
    featured: true,
    dateAdded: "2024-01-15"
  },
  {
    id: 6,
    title: "Machine Learning Crash Course",
    description: "Google's fast-paced, practical introduction to machine learning featuring TensorFlow APIs.",
    category: "Tutorials",
    type: "course",
    level: "Intermediate",
    rating: 4.9,
    url: "https://developers.google.com/machine-learning/crash-course",
    author: "Google AI",
    tags: ["Machine Learning", "TensorFlow", "Neural Networks"],
    featured: true,
    dateAdded: "2024-02-01"
  },
  {
    id: 7,
    title: "Data Visualization with D3.js",
    description: "Learn to create interactive and dynamic data visualizations using D3.js library.",
    category: "Tutorials",
    type: "tutorial",
    level: "Advanced",
    rating: 4.6,
    url: "https://observablehq.com/@d3/learn-d3",
    author: "Observable",
    tags: ["D3.js", "Visualization", "JavaScript", "Interactive Charts"],
    featured: false,
    dateAdded: "2024-01-20"
  },

  // Datasets
  {
    id: 8,
    title: "UCI Machine Learning Repository",
    description: "A collection of databases, domain theories, and data generators used by the machine learning community.",
    category: "Datasets",
    type: "dataset",
    level: "All Levels",
    rating: 4.7,
    url: "https://archive.ics.uci.edu/ml/index.php",
    author: "UC Irvine",
    tags: ["Classification", "Regression", "Clustering", "Research"],
    featured: true,
    dateAdded: "2024-01-10"
  },
  {
    id: 9,
    title: "Kaggle Datasets",
    description: "Thousands of public datasets and data projects for practice and learning data science skills.",
    category: "Datasets",
    type: "dataset",
    level: "All Levels",
    rating: 4.8,
    url: "https://www.kaggle.com/datasets",
    author: "Kaggle",
    tags: ["Competition Data", "Real-world Data", "Community"],
    featured: true,
    dateAdded: "2024-01-12"
  },
  {
    id: 10,
    title: "COVID-19 Data Repository",
    description: "Novel Coronavirus (COVID-19) Cases, provided by JHU CSSE for research and analysis.",
    category: "Datasets",
    type: "dataset",
    level: "Intermediate",
    rating: 4.5,
    url: "https://github.com/CSSEGISandData/COVID-19",
    author: "Johns Hopkins CSSE",
    tags: ["Time Series", "Geospatial", "Public Health"],
    featured: false,
    dateAdded: "2024-01-18"
  },

  // Tools
  {
    id: 11,
    title: "Jupyter Notebook",
    description: "An open-source web application for creating and sharing documents with live code, equations, and visualizations.",
    category: "Tools",
    type: "tool",
    level: "All Levels",
    rating: 4.9,
    url: "https://jupyter.org/",
    author: "Project Jupyter",
    tags: ["Python", "R", "Julia", "Interactive Computing"],
    featured: true,
    dateAdded: "2024-01-05"
  },
  {
    id: 12,
    title: "Tableau Public",
    description: "Free platform to publicly share and explore data visualizations online.",
    category: "Tools",
    type: "tool",
    level: "Beginner",
    rating: 4.6,
    url: "https://public.tableau.com/",
    author: "Tableau",
    tags: ["Data Visualization", "Dashboard", "Business Intelligence"],
    featured: false,
    dateAdded: "2024-01-08"
  },
  {
    id: 13,
    title: "Apache Spark",
    description: "Unified analytics engine for large-scale data processing with built-in modules for SQL, streaming, and machine learning.",
    category: "Tools",
    type: "tool",
    level: "Advanced",
    rating: 4.7,
    url: "https://spark.apache.org/",
    author: "Apache Software Foundation",
    tags: ["Big Data", "Distributed Computing", "MLlib", "Scala"],
    featured: false,
    dateAdded: "2024-02-05"
  },

  // Books
  {
    id: 14,
    title: "Hands-On Machine Learning",
    description: "Practical guide to machine learning with Scikit-Learn, Keras, and TensorFlow by Aurélien Géron.",
    category: "Books",
    type: "book",
    level: "Intermediate",
    rating: 4.9,
    url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
    author: "Aurélien Géron",
    tags: ["Machine Learning", "Deep Learning", "Python", "Practical"],
    featured: true,
    dateAdded: "2024-01-25"
  },
  {
    id: 15,
    title: "Python for Data Analysis",
    description: "Data wrangling with Pandas, NumPy, and IPython by Wes McKinney, creator of pandas.",
    category: "Books",
    type: "book",
    level: "Beginner",
    rating: 4.7,
    url: "https://wesmckinney.com/book/",
    author: "Wes McKinney",
    tags: ["Python", "Pandas", "Data Wrangling", "NumPy"],
    featured: true,
    dateAdded: "2024-01-22"
  },

  // Videos
  {
    id: 16,
    title: "3Blue1Brown Neural Networks",
    description: "Visual and intuitive explanation of neural networks and deep learning concepts.",
    category: "Videos",
    type: "video",
    level: "Beginner",
    rating: 4.9,
    url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    author: "3Blue1Brown",
    tags: ["Neural Networks", "Deep Learning", "Visual Learning", "Mathematics"],
    featured: true,
    dateAdded: "2024-02-10"
  },
  {
    id: 17,
    title: "StatQuest with Josh Starmer",
    description: "Statistics and machine learning concepts explained clearly and simply.",
    category: "Videos",
    type: "video",
    level: "Beginner",
    rating: 4.8,
    url: "https://www.youtube.com/c/joshstarmer",
    author: "Josh Starmer",
    tags: ["Statistics", "Machine Learning", "Concepts", "Beginner-friendly"],
    featured: false,
    dateAdded: "2024-02-12"
  },

  // Courses
  {
    id: 18,
    title: "CS50's Introduction to AI",
    description: "Harvard's introduction to artificial intelligence with Python covering search, knowledge, uncertainty, and machine learning.",
    category: "Courses",
    type: "course",
    level: "Intermediate",
    rating: 4.8,
    url: "https://cs50.harvard.edu/ai/2020/",
    author: "Harvard University",
    tags: ["Artificial Intelligence", "Python", "Algorithms", "Academic"],
    featured: true,
    dateAdded: "2024-02-15"
  },
  {
    id: 19,
    title: "Fast.ai Practical Deep Learning",
    description: "Practical deep learning for coders course focusing on getting results quickly.",
    category: "Courses",
    type: "course",
    level: "Intermediate",
    rating: 4.7,
    url: "https://course.fast.ai/",
    author: "Fast.ai",
    tags: ["Deep Learning", "Practical", "Computer Vision", "NLP"],
    featured: false,
    dateAdded: "2024-02-18"
  },

  // Research Papers
  {
    id: 20,
    title: "Attention Is All You Need",
    description: "The seminal paper introducing the Transformer architecture that revolutionized NLP.",
    category: "Research Papers",
    type: "paper",
    level: "Advanced",
    rating: 4.9,
    url: "https://arxiv.org/abs/1706.03762",
    author: "Vaswani et al.",
    tags: ["Transformers", "NLP", "Attention Mechanism", "Deep Learning"],
    featured: true,
    dateAdded: "2024-02-20"
  },

  // DataZen Curated Resources
  {
    id: 21,
    title: "DataZen AI/ML Resources Collection",
    description: "Comprehensive collection of AI and Machine Learning resources curated by the DataZen team, including tutorials, tools, papers, and learning paths.",
    category: "Tutorials",
    type: "tutorial",
    level: "All Levels",
    rating: 4.9,
    url: "https://www.notion.so/AI-ML-Resources-258a82483c5e8015aca2d7c4ebadaaf7",
    author: "DataZen Team",
    tags: ["AI", "Machine Learning", "Curated", "Comprehensive", "Learning Path"],
    featured: true,
    dateAdded: "2024-08-24"
  },

  // Competitions
  {
    id: 22,
    title: "Kaggle Competitions",
    description: "Data science competitions with real-world problems and cash prizes.",
    category: "Competitions",
    type: "competition",
    level: "All Levels",
    rating: 4.8,
    url: "https://www.kaggle.com/competitions",
    author: "Kaggle",
    tags: ["Competition", "Real-world", "Community", "Practice"],
    featured: true,
    dateAdded: "2024-01-30"
  },
  {
    id: 23,
    title: "DrivenData Competitions",
    description: "Data science competitions for social good, tackling challenges that matter.",
    category: "Competitions",
    type: "competition",
    level: "Intermediate",
    rating: 4.6,
    url: "https://www.drivendata.org/competitions/",
    author: "DrivenData",
    tags: ["Social Good", "Impact", "Environment", "Health"],
    featured: false,
    dateAdded: "2024-02-03"
  }
];

export default function Resources() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filteredResources, setFilteredResources] = useState(resources);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Update document title and handle scroll
  useEffect(() => {
    document.title = "Resources - DataZen";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter resources based on search and category
  useEffect(() => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        resource.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Get icon for resource type
  const getResourceIcon = (type: string) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case "tutorial": return <BookOpen {...iconProps} />;
      case "dataset": return <Database {...iconProps} />;
      case "tool": return <Code {...iconProps} />;
      case "book": return <FileText {...iconProps} />;
      case "video": return <Video {...iconProps} />;
      case "course": return <Users {...iconProps} />;
      case "paper": return <FileText {...iconProps} />;
      case "competition": return <Users {...iconProps} />;
      default: return <Globe {...iconProps} />;
    }
  };

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Intermediate": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Advanced": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Featured resources
  const featuredResources = resources.filter(resource => resource.featured);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground relative overflow-hidden">
      {/* Dynamic 3D Topography Background Wave */}
      <TopographyBackground />

      {/* Scroll progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-red z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      <Navbar />

      <main className="flex-1 pt-20 relative z-10">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono tracking-widest uppercase border border-border">
                Curated Repository
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight font-display">
                <span className="text-foreground">Data Science </span>
                <span className="text-gradient">Resources</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed font-body">
                Open tutorials, benchmark datasets, and technical references curated by DataZen mentors for Somaiya students.
              </p>

              <div className="h-[2px] w-16 bg-primary mx-auto mt-6" />
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-6 bg-card/40 border-y border-border backdrop-blur-md">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search resources, tools, tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 rounded-none bg-card/80 border-border"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-11 px-4 rounded-none border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              <p className="text-xs font-mono text-muted-foreground text-center">
                Found {filteredResources.length} resources
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>
        </section>

        {/* Category-based Resource Sections */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {/* College Resources Section (Top Priority) */}
            {(selectedCategory === "All" || selectedCategory === "College Resources") && (
              <motion.div
                className="mb-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-display">College Resources</h2>
                    <p className="text-muted-foreground text-sm font-body">Academic notes, study materials, and subject guides for Somaiya students</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                  {filteredResources.filter(resource => resource.category === "College Resources").map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      className="bg-card/90 rounded-none p-6 border border-border hover:border-primary/50 transition-colors duration-150 group flex flex-col h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        {resource.featured && (
                          <Badge variant="secondary" className="text-xs font-mono rounded-none">Featured</Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors font-display">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow font-body">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between mb-4 font-mono text-xs">
                        <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none" variant="outline">
                          {resource.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {resource.author}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs font-mono rounded-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" asChild className="w-full mt-auto rounded-none font-display">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          Access Notes <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Books Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">Books &amp; Publications</h2>
                  <p className="text-muted-foreground text-sm font-body">Essential reading materials and references</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(resource => resource.category === "Books").map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    className="bg-card/90 rounded-none p-6 border border-border hover:border-primary/50 transition-colors duration-150 group flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      {resource.featured && (
                        <Badge variant="secondary" className="text-xs font-mono rounded-none">Featured</Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors font-display">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow font-body">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 font-mono text-xs">
                      <Badge className={`${getLevelColor(resource.level)} rounded-none`} variant="outline">
                        {resource.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        by {resource.author}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-mono rounded-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" asChild className="w-full mt-auto rounded-none font-display">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Read Book <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Datasets Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">Datasets &amp; Data Sources</h2>
                  <p className="text-muted-foreground text-sm font-body">Curated datasets for practice, benchmark models, and projects</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(resource => resource.category === "Datasets").map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    className="bg-card/90 rounded-none p-6 border border-border hover:border-primary/50 transition-colors duration-150 group flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      {resource.featured && (
                        <Badge variant="secondary" className="text-xs font-mono rounded-none">Featured</Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors font-display">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow font-body">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 font-mono text-xs">
                      <Badge className={`${getLevelColor(resource.level)} rounded-none`} variant="outline">
                        {resource.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        by {resource.author}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-mono rounded-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" asChild className="w-full mt-auto rounded-none font-display">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Access Dataset <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tools Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">Tools &amp; Applications</h2>
                  <p className="text-muted-foreground text-sm font-body">Interactive platforms, notebooks, and libraries for data science</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(resource => resource.category === "Tools").map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    className="bg-card/90 rounded-none p-6 border border-border hover:border-primary/50 transition-colors duration-150 group flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      {resource.featured && (
                        <Badge variant="secondary" className="text-xs font-mono rounded-none">Featured</Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors font-display">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow font-body">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 font-mono text-xs">
                      <Badge className={`${getLevelColor(resource.level)} rounded-none`} variant="outline">
                        {resource.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        by {resource.author}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-mono rounded-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" asChild className="w-full mt-auto rounded-none font-display">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Open Tool <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Videos Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">Videos &amp; Tutorials</h2>
                  <p className="text-muted-foreground text-sm font-body">Technical walkthroughs and lecture materials</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(resource => resource.category === "Videos").map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    className="bg-card/90 rounded-none p-6 border border-border hover:border-primary/50 transition-colors duration-150 group flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      {resource.featured && (
                        <Badge variant="secondary" className="text-xs font-mono rounded-none">Featured</Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors font-display">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow font-body">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 font-mono text-xs">
                      <Badge className={`${getLevelColor(resource.level)} rounded-none`} variant="outline">
                        {resource.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        by {resource.author}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-mono rounded-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" asChild className="w-full mt-auto rounded-none font-display">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Watch Video <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Other Categories */}
            {["Tutorials", "Courses", "Research Papers", "Competitions"].map((category, categoryIndex) => {
              const categoryResources = filteredResources.filter(resource => resource.category === category);
              if (categoryResources.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  className="mb-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      {category === "Tutorials" && <BookOpen className="w-5 h-5" />}
                      {category === "Courses" && <Users className="w-5 h-5" />}
                      {category === "Research Papers" && <FileText className="w-5 h-5" />}
                      {category === "Competitions" && <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground font-display">{category}</h2>
                      <p className="text-muted-foreground text-sm font-body">
                        {category === "Tutorials" && "Step-by-step learning guides"}
                        {category === "Courses" && "Structured learning programs"}
                        {category === "Research Papers" && "Academic papers and research"}
                        {category === "Competitions" && "Data science challenges and contests"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryResources.map((resource, index) => (
                      <motion.div
                        key={resource.id}
                        className="bg-card/90 rounded-none p-6 border border-border hover:border-primary/50 transition-colors duration-150 group flex flex-col h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            {getResourceIcon(resource.type)}
                          </div>
                          {resource.featured && (
                            <Badge variant="secondary" className="text-xs font-mono rounded-none">Featured</Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors font-display">
                          {resource.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow font-body">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between mb-4 font-mono text-xs">
                          <Badge className={`${getLevelColor(resource.level)} rounded-none`} variant="outline">
                            {resource.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            by {resource.author}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {resource.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs font-mono rounded-none">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" asChild className="w-full mt-auto rounded-none font-display">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            View Resource <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 border-t border-border bg-card/40">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-display">
                <span className="text-foreground">Have a </span>
                <span className="text-gradient">Resource </span>
                <span className="text-foreground">to Share?</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8 font-body text-base">
                Help build our open repository by suggesting valuable research papers, notebooks, or benchmark datasets for Somaiya students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="dz-button-primary px-8 py-3 text-base">
                  Suggest a Resource
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 z-40 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="w-5 h-5 mx-auto" />
      </motion.button>
    </div>
  );
}
