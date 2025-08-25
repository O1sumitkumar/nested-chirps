import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChirpComposer from "@/components/ChirpComposer";
import ChirpCard from "@/components/ChirpCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import { useChirps } from "@/hooks/useQuery";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { data: chirpsData, isLoading, error } = useChirps();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Only show when not authenticated */}
      {!isAuthenticated && <Hero />}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Welcome Message */}
              {isAuthenticated && (
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2">Welcome to Your Feed</h2>
                  <p className="text-muted-foreground">
                    Share your thoughts and join the conversation with our community!
                  </p>
                </div>
              )}
              
              {/* Chirp Composer */}
              <ChirpComposer />
              
              {/* Dynamic Chirps Feed */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="glass-card p-4 animate-pulse">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="glass-card p-8 text-center">
                    <p className="text-muted-foreground">Failed to load chirps. Please try again.</p>
                  </div>
                ) : chirpsData?.data?.length > 0 ? (
                  chirpsData.data.map((chirp: any, index: number) => (
                    <ChirpCard key={chirp.id || index} {...chirp} />
                  ))
                ) : (
                  // Fallback to sample data if API doesn't return data
                  <div className="space-y-4">
                    <div className="glass-card p-8 text-center">
                      <p className="text-muted-foreground mb-4">No chirps available yet.</p>
                      <p className="text-sm text-muted-foreground">Be the first to share something with the community!</p>
                    </div>
                  </div>
                )}
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