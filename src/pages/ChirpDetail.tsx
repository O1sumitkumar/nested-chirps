import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import ChirpCard from "@/components/ChirpCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle, Heart, Repeat2, Share, Loader2 } from "lucide-react";
import { useChirpDetail, useReplyToChirp } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/selectors";
import { useToast } from "@/hooks/use-toast";

const ChirpDetail = () => {
  const { chirpId } = useParams<{ chirpId: string }>();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { toast } = useToast();
  const [replyText, setReplyText] = useState("");

  const { data: chirpData, isLoading } = useChirpDetail(chirpId!);
  const replyMutation = useReplyToChirp();

  const chirp = chirpData?.data;
  const replies = chirp?.replies || [];

  const handleReply = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to reply",
        variant: "destructive",
      });
      return;
    }

    if (!replyText.trim()) return;

    try {
      await replyMutation.mutateAsync({
        chirpId: chirpId!,
        content: replyText,
        userId: user.id,
      });
      
      setReplyText("");
      toast({
        title: "Reply posted!",
        description: "Your reply has been added to the conversation.",
      });
    } catch (error) {
      toast({
        title: "Failed to post reply",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="glass-card p-8 animate-pulse">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chirp) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Chirp not found</p>
            <Link to="/">
              <Button variant="outline" className="mt-4">
                Go Home
              </Button>
            </Link>
          </Card>
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
            <h1 className="text-xl font-semibold">Chirp</h1>
          </div>

          {/* Main Chirp */}
          <Card className="glass-card p-6 minimal-shadow">
            <div className="flex gap-4">
              <Link to={`/profile/${chirp.userId}`}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chirp.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {chirp.displayName?.slice(0, 2)?.toUpperCase() || chirp.username?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Link to={`/profile/${chirp.userId}`} className="hover:underline">
                    <h3 className="font-semibold text-foreground">{chirp.displayName || chirp.username}</h3>
                  </Link>
                  <span className="text-muted-foreground">@{chirp.username}</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-lg leading-relaxed">{chirp.content}</p>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4">
                  {new Date(chirp.createdAt).toLocaleString()}
                </div>
                
                {/* Engagement Stats */}
                <div className="flex gap-6 py-3 border-y border-border/50 mb-4">
                  <div className="flex gap-1">
                    <span className="font-semibold">{chirp.rechirps || 0}</span>
                    <span className="text-muted-foreground">Rechirps</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-semibold">{chirp.likes || 0}</span>
                    <span className="text-muted-foreground">Likes</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-semibold">{chirp.replies || 0}</span>
                    <span className="text-muted-foreground">Replies</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-around max-w-md border-b border-border/50 pb-4">
                  <Button variant="ghost" size="sm" className="h-10 gap-2 hover:bg-primary/10 hover:text-primary">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-10 gap-2 hover:bg-accent/10 hover:text-accent">
                    <Repeat2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-10 gap-2 hover:bg-destructive/10 hover:text-destructive">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-10 gap-2 hover:bg-primary/10 hover:text-primary">
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Reply Composer */}
          {isAuthenticated && (
            <Card className="glass-card p-4 minimal-shadow">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user?.name?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Chirp your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px] resize-none border-none p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 bg-transparent"
                    maxLength={280}
                  />
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-sm ${replyText.length > 250 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {280 - replyText.length}
                    </span>
                    <Button 
                      variant="chirp" 
                      size="sm"
                      disabled={!replyText.trim() || replyText.length > 280 || replyMutation.isPending}
                      onClick={handleReply}
                    >
                      {replyMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Reply"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Replies */}
          <div className="space-y-4">
            {replies.length > 0 ? (
              replies.map((reply: any, index: number) => (
                <ChirpCard key={reply?._id || reply?.id || index} {...reply} />
              ))
            ) : (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChirpDetail;