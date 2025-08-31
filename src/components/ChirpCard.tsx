import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLikeChirp, useUnlikeChirp, useRechirp, useUnrechirp, useDeleteChirp } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/selectors";
import { useToast } from "@/hooks/use-toast";

interface ChirpCardProps {
  // New schema fields
  _id?: string;
  userId?: string;
  username?: string;
  displayName?: string;
  handle?: string;
  avatar?: string;
  isVerified?: boolean;
  content?: string;
  mediaUrls?: string[];
  hashtags?: string[];
  mentions?: string[];
  likes?: number;
  rechirps?: number;
  replies?: number;
  views?: number;
  bookmarks?: number;
  createdAt?: string;
  updatedAt?: string;
  isReply?: boolean;
  parentChirpId?: string | null;
  threadId?: string;
  location?: string | null;
  visibility?: string;
  isPinned?: boolean;
  isPromoted?: boolean;

  // Back-compat props
  author?: {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
    verified?: boolean;
  };
  timestamp?: string;
  isLiked?: boolean;
  isRechirped?: boolean;
}

const ChirpCard = ({ 
  _id,
  userId,
  author,
  content,
  timestamp,
  likes,
  rechirps,
  replies,
  isLiked = false,
  isRechirped = false,
  username,
  displayName,
  handle,
  avatar,
  isVerified,
  createdAt,
}: ChirpCardProps) => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { toast } = useToast();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [isRechirpedState, setIsRechirpedState] = useState(isRechirped);
  const [likesCount, setLikesCount] = useState(likes || 0);
  const [rechirpsCount, setRechirpsCount] = useState(rechirps || 0);

  const likeMutation = useLikeChirp();
  const unlikeMutation = useUnlikeChirp();
  const rechirpMutation = useRechirp();
  const unrechirpMutation = useUnrechirp();
  const deleteMutation = useDeleteChirp();
  const chirpId = _id;
  const chirpUserId = userId || author?.id;
  const isOwnChirp = user?.id === chirpUserId;

  const handleLike = async () => {
    if (!isAuthenticated || !user || !chirpId) {
      toast({ title: "Please sign in to like chirps", variant: "destructive" });
      return;
    }

    try {
      if (isLikedState) {
        await unlikeMutation.mutateAsync({ chirpId, userId: user.id });
        setIsLikedState(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await likeMutation.mutateAsync({ chirpId, userId: user.id });
        setIsLikedState(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      toast({ title: "Action failed", description: "Please try again", variant: "destructive" });
    }
  };

  const handleRechirp = async () => {
    if (!isAuthenticated || !user || !chirpId) {
      toast({ title: "Please sign in to rechirp", variant: "destructive" });
      return;
    }

    try {
      if (isRechirpedState) {
        await unrechirpMutation.mutateAsync({ chirpId, userId: user.id });
        setIsRechirpedState(false);
        setRechirpsCount(prev => Math.max(0, prev - 1));
      } else {
        await rechirpMutation.mutateAsync({ chirpId, userId: user.id });
        setIsRechirpedState(true);
        setRechirpsCount(prev => prev + 1);
      }
    } catch (error) {
      toast({ title: "Action failed", description: "Please try again", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated || !user || !chirpId) return;

    try {
      await deleteMutation.mutateAsync({ chirpId, userId: user.id });
      toast({ title: "Chirp deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete chirp", variant: "destructive" });
    }
  };

  const displayNameResolved = displayName ?? author?.name ?? 'User';
  const usernameResolved = (handle?.replace(/^@/, '') || username || author?.username || 'user');
  const avatarResolved = avatar ?? author?.avatar;
  const verifiedResolved = typeof isVerified === 'boolean' ? isVerified : Boolean(author?.verified);
  const timestampResolved = timestamp ?? createdAt ?? '';
  const likesResolved = likes ?? 0;
  const rechirpsResolved = rechirps ?? 0;
  const repliesResolved = replies ?? 0;
  return (
    <Card className="p-4 border-border/50 hover:bg-muted/20 transition-colors">
      <div className="flex gap-3">
        <Link to={`/profile/${chirpUserId}`}>
          <Avatar className="w-10 h-10 cursor-pointer">
            <AvatarImage src={avatarResolved} />
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
              {displayNameResolved?.slice(0, 2)?.toUpperCase?.()}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/profile/${chirpUserId}`} className="hover:underline">
              <h3 className="font-semibold text-foreground truncate">{displayNameResolved}</h3>
            </Link>
            {verifiedResolved && (
              <Verified className="w-4 h-4 text-primary fill-current" />
            )}
            <span className="text-muted-foreground text-sm">@{usernameResolved}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{timestampResolved}</span>
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                {isOwnChirp && (
                  <>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Content */}
          <Link to={`/chirp/${chirpId}`} className="block mb-3 cursor-pointer">
            <p className="text-foreground leading-relaxed hover:text-foreground/80">{content ?? ''}</p>
          </Link>
          
          {/* Actions */}
          <div className="flex items-center justify-between max-w-md">
            <Link to={`/chirp/${chirpId}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-2 hover:bg-primary/10 hover:text-primary group"
              >
                <MessageCircle className="w-4 h-4 group-hover:fill-current" />
                <span className="text-sm">{repliesResolved > 0 ? repliesResolved : ''}</span>
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 gap-2 group ${
                isRechirpedState 
                  ? 'text-accent hover:bg-accent/10' 
                  : 'hover:bg-accent/10 hover:text-accent'
              }`}
              onClick={handleRechirp}
              disabled={rechirpMutation.isPending || unrechirpMutation.isPending}
            >
              <Repeat2 className="w-4 h-4 group-hover:fill-current" />
              <span className="text-sm">{rechirpsCount > 0 ? rechirpsCount : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 gap-2 group ${
                isLikedState 
                  ? 'text-destructive hover:bg-destructive/10' 
                  : 'hover:bg-destructive/10 hover:text-destructive'
              }`}
              onClick={handleLike}
              disabled={likeMutation.isPending || unlikeMutation.isPending}
            >
              <Heart className={`w-4 h-4 ${isLikedState ? 'fill-current' : 'group-hover:fill-current'}`} />
              <span className="text-sm">{likesCount > 0 ? likesCount : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-2 hover:bg-primary/10 hover:text-primary group"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChirpCard;