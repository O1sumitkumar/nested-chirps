import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Users, MoreHorizontal, Verified } from "lucide-react";
import techNewsAvatar from "@/assets/avatars/tech-news.jpg";
import designInspirationAvatar from "@/assets/avatars/design-inspiration.jpg";
import startupStoriesAvatar from "@/assets/avatars/startup-stories.jpg";

const TrendingSidebar = () => {
  const trends = [
    { topic: "#ChirpNest", chirps: "12.5K", category: "Technology" },
    { topic: "Social Media", chirps: "8.2K", category: "Trending" },
    { topic: "#WebDevelopment", chirps: "6.8K", category: "Technology" },
    { topic: "Community", chirps: "4.3K", category: "Trending" },
    { topic: "#Innovation", chirps: "3.1K", category: "Business" },
  ];

  const suggestions = [
    { name: "Tech News", username: "technews", verified: true, followers: "1.2M", avatar: techNewsAvatar },
    { name: "Design Inspiration", username: "designinspo", verified: false, followers: "850K", avatar: designInspirationAvatar },
    { name: "Startup Stories", username: "startupstories", verified: true, followers: "650K", avatar: startupStoriesAvatar },
  ];

  return (
    <div className="space-y-6">
      {/* Trending */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">What's happening</h2>
        </div>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div key={index} className="hover:bg-muted/50 p-2 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{trend.category} · Trending</p>
                  <p className="font-semibold text-foreground">{trend.topic}</p>
                  <p className="text-sm text-muted-foreground">{trend.chirps} Chirps</p>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-3 text-primary hover:bg-primary/10">
          Show more
        </Button>
      </Card>

      {/* Who to follow */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Who to follow</h2>
        </div>
        <div className="space-y-4">
          {suggestions.map((user, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  {user.verified && <Verified className="w-3 h-3 text-primary fill-current" />}
                </div>
                <p className="text-muted-foreground text-sm">@{user.username}</p>
                <p className="text-muted-foreground text-xs">{user.followers} followers</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Follow
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-3 text-primary hover:bg-primary/10">
          Show more
        </Button>
      </Card>

      {/* Footer */}
      <div className="px-4 py-2 text-xs text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help Center</a>
        </div>
        <p>© 2024 ChirpNest</p>
      </div>
    </div>
  );
};

export default TrendingSidebar;