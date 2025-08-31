import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Bell, MessageCircle, Users, Home, Hash, BookmarkCheck, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/selectors";
import { logout } from "@/store/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging
  console.log('Header: Auth state', { isAuthenticated, user: !!user, userName: user?.name });

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get button variant based on active state
  const getButtonVariant = (path: string) => {
    return isActivePath(path) ? "secondary" : "ghost";
  };

  // Helper function to get button classes based on active state
  const getButtonClasses = (path: string) => {
    const baseClasses = "gap-2 transition-all duration-200";
    if (isActivePath(path)) {
      return `${baseClasses} bg-primary/10 text-primary border-primary/20 font-medium`;
    }
    return `${baseClasses} hover:bg-primary/10`;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-border/50 minimal-shadow">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ChirpNest
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant={getButtonVariant('/')} size="sm" className={getButtonClasses('/')}>
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant={getButtonVariant('/explore')} size="sm" className={getButtonClasses('/explore')}>
                <Hash className="w-4 h-4" />
                <span>Explore</span>
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link to={`/profile/${user?.id}`}>
                  <Button variant={getButtonVariant('/profile')} size="sm" className={getButtonClasses('/profile')}>
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Link to="/notifications">
                  <Button variant={getButtonVariant('/notifications')} size="sm" className={getButtonClasses('/notifications')}>
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button variant={getButtonVariant('/messages')} size="sm" className={getButtonClasses('/messages')}>
                    <MessageCircle className="w-4 h-4" />
                    <span>Messages</span>
                  </Button>
                </Link>
                <Link to="/bookmarks">
                  <Button variant={getButtonVariant('/bookmarks')} size="sm" className={getButtonClasses('/bookmarks')}>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Bookmarks</span>
                  </Button>
                </Link>
                <Link to="/communities">
                  <Button variant={getButtonVariant('/communities')} size="sm" className={getButtonClasses('/communities')}>
                    <Users className="w-4 h-4" />
                    <span>Communities</span>
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search ChirpNest..."
              className="pl-10 bg-background/50 border-border/60 focus:bg-background/80 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link to={`/profile/${user?.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm">
                  Join ChirpNest
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;