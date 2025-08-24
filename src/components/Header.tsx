import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, MessageCircle, Users, Home, Hash, BookmarkCheck } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ChirpNest
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Hash className="w-4 h-4" />
              <span>Explore</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Messages</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <BookmarkCheck className="w-4 h-4" />
              <span>Bookmarks</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              <span>Communities</span>
            </Button>
          </nav>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search ChirpNest..."
              className="pl-10 bg-muted/50 border-none focus:bg-card focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="hero" size="sm">
            Join ChirpNest
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;