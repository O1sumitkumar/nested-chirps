import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChirpComposer from "@/components/ChirpComposer";
import ChirpCard from "@/components/ChirpCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import sarahChenAvatar from "@/assets/avatars/sarah-chen.jpg";
import alexRodriguezAvatar from "@/assets/avatars/alex-rodriguez.jpg";
import techNewsDailyAvatar from "@/assets/avatars/tech-news-daily.jpg";
import mayaPatelAvatar from "@/assets/avatars/maya-patel.jpg";

const sampleChirps = [
  {
    author: {
      name: "Sarah Chen",
      username: "sarahc_dev",
      verified: true,
      avatar: sarahChenAvatar,
    },
    content: "Just launched my first React app on ChirpNest! The community here is so welcoming and supportive. Loving the clean design and smooth interactions. This is definitely going to be my new favorite social platform! 🚀 #ChirpNest #WebDev",
    timestamp: "2h",
    likes: 42,
    rechirps: 12,
    replies: 8,
    isLiked: true,
  },
  {
    author: {
      name: "Alex Rodriguez",
      username: "alexr_designer",
      verified: false,
      avatar: alexRodriguezAvatar,
    },
    content: "The UI/UX design of ChirpNest is absolutely stunning! Love the warm color palette and smooth animations. It feels like Twitter but with a modern, cozy twist. Great job to the design team! 🎨",
    timestamp: "4h",
    likes: 28,
    rechirps: 6,
    replies: 15,
  },
  {
    author: {
      name: "Tech News Daily",
      username: "technewsdaily",
      verified: true,
      avatar: techNewsDailyAvatar,
    },
    content: "BREAKING: New social platform ChirpNest gains 10K users in first week! Features include real-time messaging, community building, and AI-powered content curation. The future of social media is looking bright! 📱✨",
    timestamp: "6h",
    likes: 156,
    rechirps: 89,
    replies: 34,
    isRechirped: true,
  },
  {
    author: {
      name: "Maya Patel",
      username: "mayap_startup",
      verified: false,
      avatar: mayaPatelAvatar,
    },
    content: "Building a startup is like building a nest - it takes time, patience, and the right community to support you. Grateful for all the amazing connections I've made here on ChirpNest! 🏠💙",
    timestamp: "8h",
    likes: 73,
    rechirps: 22,
    replies: 19,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Feed</h2>
                <p className="text-muted-foreground">
                  Share your thoughts and join the conversation with our community!
                </p>
              </div>
              
              {/* Chirp Composer */}
              <ChirpComposer />
              
              {/* Sample Chirps */}
              <div className="space-y-4">
                {sampleChirps.map((chirp, index) => (
                  <ChirpCard key={index} {...chirp} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-20">
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;