import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Verified } from "lucide-react";
import { useFollowing, useFollowUser, useUnfollowUser } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/selectors";
import { useState } from "react";

const Following = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  const { data: followingData, isLoading } = useFollowing(userId!);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const following = followingData?.data || [];

  const handleFollowToggle = async (followeeId: string, isCurrentlyFollowing: boolean) => {
    if (!isAuthenticated || !currentUser) return;

    try {
      if (isCurrentlyFollowing) {
        await unfollowMutation.mutateAsync({
          followerId: currentUser.id,
          followeeId,
        });
        setFollowingStates(prev => ({ ...prev, [followeeId]: false }));
      } else {
        await followMutation.mutateAsync({
          followerId: currentUser.id,
          followeeId,
        });
        setFollowingStates(prev => ({ ...prev, [followeeId]: true }));
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to={`/profile/${userId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Following</h1>
          </div>

          {/* Following List */}
          <div className="space-y-3">
            {following.length > 0 ? (
              following.map((user: any) => {
                const isFollowing = followingStates[user.id] ?? true; // Default to true since they're in following list
                const isOwnProfile = currentUser?.id === user.id;
                
                return (
                  <Card key={user.id} className="glass-card p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Link to={`/profile/${user.id}`}>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {user.name?.slice(0, 2)?.toUpperCase() || user.username?.slice(0, 2)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link to={`/profile/${user.id}`} className="hover:underline">
                              <h3 className="font-semibold text-foreground truncate">{user.name || user.username}</h3>
                            </Link>
                            {user.verified && (
                              <Verified className="w-4 h-4 text-primary fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          {user.bio && (
                            <p className="text-sm text-foreground mt-1 line-clamp-2">{user.bio}</p>
                          )}
                        </div>
                      </div>
                      
                      {!isOwnProfile && isAuthenticated && (
                        <Button
                          variant={isFollowing ? "outline" : "hero"}
                          size="sm"
                          onClick={() => handleFollowToggle(user.id, isFollowing)}
                          disabled={followMutation.isPending || unfollowMutation.isPending}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Not following anyone yet</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Following;