import { useState } from "react";
import { useCommunities, useJoinCommunity, useLeaveCommunity } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/selectors";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, TrendingUp, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Communities = () => {
  const user = useAppSelector(selectCurrentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'discover' | 'joined'>('discover');
  
  const { data: communities, isLoading, error } = useCommunities(user?.id || '');
  const joinCommunityMutation = useJoinCommunity();
  const leaveCommunityMutation = useLeaveCommunity();

  const handleJoinCommunity = (communityId: string) => {
    if (user?.id) {
      joinCommunityMutation.mutate({ communityId, userId: user.id });
    }
  };

  const handleLeaveCommunity = (communityId: string) => {
    if (user?.id) {
      leaveCommunityMutation.mutate({ communityId, userId: user.id });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto pt-20">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto pt-20 px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load communities</p>
          </div>
        </main>
      </div>
    );
  }

  const communitiesArray = Array.isArray(communities) ? communities : [];
  const filteredCommunities = communitiesArray.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const joinedCommunities = filteredCommunities.filter(community => 
    community.members?.some(member => member.id === user?.id)
  );
  
  const discoverCommunities = filteredCommunities.filter(community => 
    !community.members?.some(member => member.id === user?.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto pt-20 px-4">
        {/* Header Section */}
        <div className="border-b border-border/40 pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Communities</h1>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Community
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'discover' | 'joined')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="joined">Joined ({joinedCommunities.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {discoverCommunities.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No communities found</h3>
                    <p className="text-muted-foreground text-sm">Try adjusting your search terms or create a new community.</p>
                  </div>
                ) : (
                  discoverCommunities.map((community) => (
                    <Card key={community.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={community.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {community.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{community.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {community.memberCount || 0} members
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {community.postCount || 0} posts
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {community.tags && community.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {community.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={community.isPrivate ? "destructive" : "default"} className="text-xs">
                            {community.isPrivate ? "Private" : "Public"}
                          </Badge>
                          {community.isActive && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-500">Active</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleJoinCommunity(community.id)}
                          disabled={joinCommunityMutation.isPending}
                        >
                          {community.isPrivate ? "Request to Join" : "Join"}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="joined" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {joinedCommunities.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No joined communities</h3>
                    <p className="text-muted-foreground text-sm">Explore and join communities to connect with like-minded people.</p>
                  </div>
                ) : (
                  joinedCommunities.map((community) => (
                    <Card key={community.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={community.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {community.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{community.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {community.memberCount || 0} members
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {community.postCount || 0} posts
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="default" className="text-xs">
                          Member since {new Date(community.joinedAt || Date.now()).toLocaleDateString()}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleLeaveCommunity(community.id)}
                          disabled={leaveCommunityMutation.isPending}
                        >
                          Leave
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Communities;