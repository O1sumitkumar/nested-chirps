import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Users, Hash, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <img 
          src={heroImage} 
          alt="ChirpNest Hero" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome to the Future of Social</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
            Connect, Share, and{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Chirp
            </span>{" "}
            with the World
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Join ChirpNest, where every voice matters. Share your thoughts, discover trending topics, 
            and build meaningful connections in a community that values authentic conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chirping
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:bg-primary/5">
              <Users className="w-5 h-5 mr-2" />
              Explore Communities
            </Button>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Conversations</h3>
              <p className="text-muted-foreground">
                Share your thoughts instantly and engage in meaningful discussions with people worldwide.
              </p>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur border-accent/10 hover:border-accent/20 transition-all duration-300 hover:shadow-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trending Topics</h3>
              <p className="text-muted-foreground">
                Stay updated with what's happening around you and join conversations that matter.
              </p>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-glow to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Build Communities</h3>
              <p className="text-muted-foreground">
                Create and join communities around your interests and connect with like-minded people.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;