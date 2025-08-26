import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, TrendingUp, Users, Hash, MapPin } from "lucide-react";
import { useSearchChirps, useSearchUsers, useTrending } from "@/hooks/useQuery";
import ChirpCard from "@/components/ChirpCard";
import Header from "@/components/Header";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  
  const { data: trendingData } = useTrending();
  const { data: searchChirps } = useSearchChirps(activeSearch);
  const { data: searchUsers } = useSearchUsers(activeSearch);

  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <div className="glass-card p-6 rounded-xl glass-shadow">
              <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Search className="w-8 h-8 text-primary" />
                Explore ChirpNest
              </h1>
              <p className="text-muted-foreground mb-6">
                Discover trending topics, find new people to follow, and explore conversations
              </p>
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search for chirps, people, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-11 h-12 bg-background/50 border-border/60 focus:border-primary/50"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-6 bg-primary hover:bg-primary/90"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeSearch ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Search Results for "{activeSearch}"</h2>
              
              <Tabs defaultValue="chirps" className="w-full">
                <TabsList className="glass-card">
                  <TabsTrigger value="chirps" className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Chirps
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    People
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chirps" className="space-y-4">
                  {searchChirps?.data?.map((chirp: any, index: number) => (
                    <ChirpCard key={chirp?._id || chirp?.id || index} {...chirp} />
                  )) || (
                    <Card className="glass-card p-8 text-center">
                      <p className="text-muted-foreground">No chirps found for "{activeSearch}"</p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="people" className="space-y-4">
                  <div className="grid gap-4">
                    {searchUsers?.data?.map((user: any, index: number) => (
                      <Card key={index} className="glass-card p-4 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {user.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-muted-foreground">@{user.username}</p>
                            {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
                          </div>
                          <Button variant="outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      </Card>
                    )) || (
                      <Card className="glass-card p-8 text-center">
                        <p className="text-muted-foreground">No users found for "{activeSearch}"</p>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Trending Topics */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Trending Now
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingData?.data?.map((topic: any, index: number) => (
                    <Card key={index} className="glass-card p-4 hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Hash className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{topic.hashtag || topic.topic}</h3>
                          <p className="text-sm text-muted-foreground">
                            {topic.chirps || topic.posts} chirps
                          </p>
                        </div>
                      </div>
                    </Card>
                  )) || (
                    // Fallback trending topics
                    [...Array(6)].map((_, index) => (
                      <Card key={index} className="glass-card p-4 hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Hash className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">#{['ChirpNest', 'WebDev', 'AI', 'Startup', 'Design', 'Tech'][index]}</h3>
                            <p className="text-sm text-muted-foreground">
                              {Math.floor(Math.random() * 1000) + 100} chirps
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Popular Locations */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-accent" />
                  Popular Locations
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['San Francisco, CA', 'New York, NY', 'London, UK', 'Tokyo, Japan', 'Berlin, Germany', 'Sydney, Australia'].map((location, index) => (
                    <Card key={index} className="glass-card p-4 hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{location}</h3>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 500) + 50} active chirpers
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;