import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Smile, MapPin, Calendar, MoreHorizontal, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/selectors";
import { useCreateChirp } from "@/hooks/useQuery";
import { useToast } from "@/hooks/use-toast";
import type { CreateChirpPayload } from "@/services/api";

const ChirpComposer = () => {
  const [chirpText, setChirpText] = useState("");
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const { toast } = useToast();
  const createChirpMutation = useCreateChirp();
  const maxLength = 280;

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to chirp",
        variant: "destructive",
      });
      return;
    }

    if (!chirpText.trim()) return;

    try {
      // Extract hashtags and mentions from content
      const hashtags = (chirpText.match(/#\w+/g) || []).map(tag => tag.substring(1));
      const mentions = (chirpText.match(/@\w+/g) || []).map(mention => mention.substring(1));
      
      // Create payload matching backend structure
      const payload: CreateChirpPayload = {
        userid: user.id,
        username: user.username || 'user',
        displayname: user.name || 'User',
        handle: `@${user.username || 'user'}`,
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'user'}`,
        isverified: user.verified || false,
        content: chirpText.trim(),
        mediaurls: [], // TODO: Add media upload functionality
        hashtags,
        mentions,
        location: null, // TODO: Add location functionality
        visibility: 'public',
        isreply: false,
        parentchirpid: null,
        threadid: undefined,
      };

      await createChirpMutation.mutateAsync(payload);
      
      setChirpText("");
      toast({
        title: "Chirp posted!",
        description: "Your chirp has been shared with the world.",
      });
    } catch (error) {
      console.error('Chirp creation error:', error);
      toast({
        title: "Failed to post chirp",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Card className="glass-card p-6 mb-6 text-center">
        <p className="text-muted-foreground mb-4">Sign in to start chirping!</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="sm">Join ChirpNest</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-4 mb-6 minimal-shadow">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AN'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="What's chirping in your mind?"
            value={chirpText}
            onChange={(e) => setChirpText(e.target.value)}
            className="min-h-[100px] resize-none border-none p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0 bg-transparent"
            maxLength={maxLength}
          />
          
          {/* Actions Bar */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                <Image className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                <Smile className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                <MapPin className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                <Calendar className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                <MoreHorizontal className="w-4 h-4 text-primary" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`text-sm ${chirpText.length > maxLength * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {maxLength - chirpText.length}
              </span>
              <Button 
                variant="chirp" 
                size="sm"
                disabled={!chirpText.trim() || chirpText.length > maxLength || createChirpMutation.isPending}
                className="min-w-[80px]"
                onClick={handleSubmit}
              >
                {createChirpMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Chirp"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChirpComposer;