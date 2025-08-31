import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import ChirpCard from "@/components/ChirpCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Link2, MoreHorizontal, ArrowLeft, Verified } from "lucide-react";
import { useUserProfile, useUserChirps, useFollowUser, useUnfollowUser, useFollowers, useFollowing } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/selectors";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: profileData, isLoading: profileLoading } = useUserProfile(userId!);
  const { data: chirpsData, isLoading: chirpsLoading } = useUserChirps(userId!);
  const { data: followersData } = useFollowers(userId!);
  const { data: followingData } = useFollowing(userId!);
  
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const profile = profileData?.data;
  const chirps = chirpsData?.data || [];
  const followers = followersData?.data || [];
  const following = followingData?.data || [];

  const isOwnProfile = currentUser?.id === userId;

  const handleFollowToggle = async () => {
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow users",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync({
          followerId: currentUser.id,
          followeeId: userId!,
        });
        setIsFollowing(false);
        toast({ title: "Unfollowed successfully" });
      } else {
        await followMutation.mutateAsync({
          followerId: currentUser.id,
          followeeId: userId!,
        });
        setIsFollowing(true);
        toast({ title: "Following successfully" });
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="glass-card p-8 animate-pulse">
            <div className="h-32 bg-muted rounded mb-4"></div>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
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
          {/* Back Button */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
          </div>

          {/* Profile Header */}
          <Card className="glass-card minimal-shadow overflow-hidden">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20"></div>
            
            {/* Profile Info */}
            <div className="p-6">
              <div className="flex items-start justify-between -mt-16 mb-4">
                <Avatar className="w-20 h-20 border-4 border-background">
                  <AvatarImage src={profile?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {profile?.name?.slice(0, 2)?.toUpperCase() || profile?.username?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  {!isOwnProfile && isAuthenticated && (
                    <Button 
                      variant={isFollowing ? "outline" : "hero"}
                      size="sm"
                      onClick={handleFollowToggle}
                      disabled={followMutation.isPending || unfollowMutation.isPending}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile?.name || profile?.username}</h1>
                    {profile?.verified && (
                      <Verified className="w-5 h-5 text-primary fill-current" />
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                </div>

                {profile?.bio && (
                  <p className="text-foreground leading-relaxed">{profile.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {profile?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center gap-1">
                      <Link2 className="w-4 h-4" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile?.joinedDate && (
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-6 text-sm">
                  <Link to={`/profile/${userId}/following`} className="hover:underline">
                    <span className="font-semibold">{following.length}</span>
                    <span className="text-muted-foreground ml-1">Following</span>
                  </Link>
                  <Link to={`/profile/${userId}/followers`} className="hover:underline">
                    <span className="font-semibold">{followers.length}</span>
                    <span className="text-muted-foreground ml-1">Followers</span>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="chirps" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-card">
              <TabsTrigger value="chirps">Chirps</TabsTrigger>
              <TabsTrigger value="replies">Replies</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chirps" className="space-y-4">
              {chirpsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass-card p-4 animate-pulse">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : chirps.length > 0 ? (
                chirps.map((chirp: any, index: number) => (
                  <ChirpCard key={chirp?._id || chirp?.id || index} {...chirp} />
                ))
              ) : (
                <Card className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No chirps yet</p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="replies" className="space-y-4">
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Replies coming soon</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Media coming soon</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="likes" className="space-y-4">
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Liked chirps coming soon</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;