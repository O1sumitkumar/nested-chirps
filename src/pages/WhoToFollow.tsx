import { useState } from "react";
import { useWhoToFollowExtended, useFollowUser, useUnfollowUser } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/selectors";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, UserPlus, TrendingUp } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";

const WhoToFollow = () => {
  const user = useAppSelector(selectCurrentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'suggested' | 'trending' | 'new'>('suggested');
  
  const { data: suggestedUsers, isLoading, error } = useWhoToFollowExtended(user?.id || '');
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  const handleFollowUser = (targetUserId: string) => {
    if (user?.id) {
      followUserMutation.mutate({ 
        followerId: user.id, 
        followeeId: targetUserId 
      });
    }
  };

  const handleUnfollowUser = (targetUserId: string) => {
    if (user?.id) {
      unfollowUserMutation.mutate({ 
        followerId: user.id, 
        followeeId: targetUserId 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto pt-20">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto pt-20 px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load suggestions</p>
          </div>
        </main>
      </div>
    );
  }

  const usersArray = Array.isArray(suggestedUsers) ? suggestedUsers : [];
  const filteredUsers = usersArray.filter(suggestedUser =>
    suggestedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestedUser.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestedUser.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suggestedUsersList = filteredUsers.filter(u => u.category === 'suggested');
  const trendingUsers = filteredUsers.filter(u => u.category === 'trending');
  const newUsers = filteredUsers.filter(u => u.category === 'new');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto pt-20 px-4">
        {/* Header Section */}
        <div className="border-b border-border/40 pb-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Who to follow</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Discover amazing people and expand your network
          </p>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'suggested' | 'trending' | 'new')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="suggested">Suggested</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New Users</TabsTrigger>
            </TabsList>

            <TabsContent value="suggested" className="mt-6">
              <div className="space-y-4">
                {suggestedUsersList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No suggestions found</h3>
                    <p className="text-muted-foreground text-sm">Try adjusting your search terms.</p>
                  </div>
                ) : (
                  suggestedUsersList.map((suggestedUser) => (
                    <Card key={suggestedUser.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={suggestedUser.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {suggestedUser.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{suggestedUser.name}</h3>
                            {suggestedUser.verified && <VerifiedBadge className="w-4 h-4" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">@{suggestedUser.username}</p>
                          {suggestedUser.bio && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{suggestedUser.bio}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>{suggestedUser.followersCount || 0} followers</span>
                            <span>{suggestedUser.followingCount || 0} following</span>
                            {suggestedUser.mutualFollows > 0 && (
                              <span className="text-primary">{suggestedUser.mutualFollows} mutual</span>
                            )}
                          </div>

                          {suggestedUser.interests && suggestedUser.interests.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {suggestedUser.interests.slice(0, 3).map((interest, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant={suggestedUser.isFollowing ? "outline" : "default"}
                          size="sm"
                          onClick={() => 
                            suggestedUser.isFollowing 
                              ? handleUnfollowUser(suggestedUser.id)
                              : handleFollowUser(suggestedUser.id)
                          }
                          disabled={followUserMutation.isPending || unfollowUserMutation.isPending}
                        >
                          {suggestedUser.isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <div className="space-y-4">
                {trendingUsers.map((trendingUser) => (
                  <Card key={trendingUser.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={trendingUser.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {trendingUser.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{trendingUser.name}</h3>
                          {trendingUser.verified && <VerifiedBadge className="w-4 h-4" />}
                          <div className="flex items-center gap-1 text-green-500">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-xs">Trending</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">@{trendingUser.username}</p>
                        {trendingUser.bio && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{trendingUser.bio}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{trendingUser.followersCount || 0} followers</span>
                          <span className="text-green-500">+{trendingUser.recentGrowth || 0} this week</span>
                        </div>
                      </div>
                      <Button 
                        variant={trendingUser.isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={() => 
                          trendingUser.isFollowing 
                            ? handleUnfollowUser(trendingUser.id)
                            : handleFollowUser(trendingUser.id)
                        }
                      >
                        {trendingUser.isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              <div className="space-y-4">
                {newUsers.map((newUser) => (
                  <Card key={newUser.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={newUser.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {newUser.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{newUser.name}</h3>
                          {newUser.verified && <VerifiedBadge className="w-4 h-4" />}
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">@{newUser.username}</p>
                        {newUser.bio && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{newUser.bio}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Joined {new Date(newUser.joinedAt || Date.now()).toLocaleDateString()}</span>
                          <span>{newUser.followersCount || 0} followers</span>
                        </div>
                      </div>
                      <Button 
                        variant={newUser.isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={() => 
                          newUser.isFollowing 
                            ? handleUnfollowUser(newUser.id)
                            : handleFollowUser(newUser.id)
                        }
                      >
                        {newUser.isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default WhoToFollow;