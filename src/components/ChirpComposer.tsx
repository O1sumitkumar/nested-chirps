import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Smile, MapPin, Calendar, MoreHorizontal } from "lucide-react";

const ChirpComposer = () => {
  const [chirpText, setChirpText] = useState("");
  const maxLength = 280;

  return (
    <Card className="p-4 mb-6 border-border/50">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
            YU
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="What's chirping in your mind?"
            value={chirpText}
            onChange={(e) => setChirpText(e.target.value)}
            className="min-h-[100px] resize-none border-none p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
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
                disabled={!chirpText.trim() || chirpText.length > maxLength}
                className="min-w-[80px]"
              >
                Chirp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChirpComposer;