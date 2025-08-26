import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified } from "lucide-react";

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
  const displayNameResolved = displayName ?? author?.name ?? 'User';
  const usernameResolved = (handle?.replace(/^@/, '') || username || author?.username || 'user');
  const avatarResolved = avatar ?? author?.avatar;
  const verifiedResolved = typeof isVerified === 'boolean' ? isVerified : Boolean(author?.verified);
  const timestampResolved = timestamp ?? createdAt ?? '';
  const likesResolved = likes ?? 0;
  const rechirpsResolved = rechirps ?? 0;
  const repliesResolved = replies ?? 0;
  return (
    <Card className="p-4 border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarResolved} />
          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
            {displayNameResolved?.slice(0, 2)?.toUpperCase?.()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{displayNameResolved}</h3>
            {verifiedResolved && (
              <Verified className="w-4 h-4 text-primary fill-current" />
            )}
            <span className="text-muted-foreground text-sm">@{usernameResolved}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{timestampResolved}</span>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="mb-3">
            <p className="text-foreground leading-relaxed">{content ?? ''}</p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between max-w-md">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-2 hover:bg-primary/10 hover:text-primary group"
            >
              <MessageCircle className="w-4 h-4 group-hover:fill-current" />
              <span className="text-sm">{repliesResolved > 0 ? repliesResolved : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 gap-2 group ${
                isRechirped 
                  ? 'text-accent hover:bg-accent/10' 
                  : 'hover:bg-accent/10 hover:text-accent'
              }`}
            >
              <Repeat2 className="w-4 h-4 group-hover:fill-current" />
              <span className="text-sm">{rechirpsResolved > 0 ? rechirpsResolved : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 gap-2 group ${
                isLiked 
                  ? 'text-destructive hover:bg-destructive/10' 
                  : 'hover:bg-destructive/10 hover:text-destructive'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : 'group-hover:fill-current'}`} />
              <span className="text-sm">{likesResolved > 0 ? likesResolved : ''}</span>
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