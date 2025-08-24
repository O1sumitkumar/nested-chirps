import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified } from "lucide-react";

interface ChirpCardProps {
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  rechirps: number;
  replies: number;
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
  isRechirped = false 
}: ChirpCardProps) => {
  return (
    <Card className="p-4 border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={author.avatar} />
          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
            {author.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{author.name}</h3>
            {author.verified && (
              <Verified className="w-4 h-4 text-primary fill-current" />
            )}
            <span className="text-muted-foreground text-sm">@{author.username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{timestamp}</span>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="mb-3">
            <p className="text-foreground leading-relaxed">{content}</p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between max-w-md">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-2 hover:bg-primary/10 hover:text-primary group"
            >
              <MessageCircle className="w-4 h-4 group-hover:fill-current" />
              <span className="text-sm">{replies > 0 ? replies : ''}</span>
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
              <span className="text-sm">{rechirps > 0 ? rechirps : ''}</span>
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
              <span className="text-sm">{likes > 0 ? likes : ''}</span>
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