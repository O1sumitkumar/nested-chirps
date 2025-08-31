import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Repeat2, UserPlus, Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/selectors";
import { Link } from "react-router-dom";

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'like':
      return <Heart className="w-5 h-5 text-destructive fill-current" />;
    case 'reply':
      return <MessageCircle className="w-5 h-5 text-primary" />;
    case 'retweet':
      return <Repeat2 className="w-5 h-5 text-accent" />;
    case 'follow':
      return <UserPlus className="w-5 h-5 text-primary" />;
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

const Notifications = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: notificationsData, isLoading } = useNotifications(user?.id || '');

  const notifications = notificationsData?.data || [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">Please sign in to view notifications</p>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {notifications.some((n: any) => !n.read) && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {notifications.filter((n: any) => !n.read).length} New
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <Card 
                  key={notification.id} 
                  className={`glass-card p-4 hover:bg-muted/20 transition-colors ${
                    !notification.read ? 'border-primary/30 bg-primary/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <NotificationIcon type={notification.type} />
                    </div>
                    
                    <div className="flex gap-3 flex-1">
                      <Link to={`/profile/${notification.actorId}`}>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={notification.actorAvatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {notification.actorName?.slice(0, 2)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link to={`/profile/${notification.actorId}`} className="hover:underline">
                            <span className="font-semibold">{notification.actorName}</span>
                          </Link>
                          <span className="text-muted-foreground text-sm">
                            {notification.type === 'like' && 'liked your chirp'}
                            {notification.type === 'reply' && 'replied to your chirp'}
                            {notification.type === 'retweet' && 'rechirped your chirp'}
                            {notification.type === 'follow' && 'started following you'}
                          </span>
                        </div>
                        
                        {notification.chirpContent && (
                          <Link to={`/chirp/${notification.chirpId}`}>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded mt-2 hover:bg-muted/50 transition-colors">
                              {notification.chirpContent}
                            </p>
                          </Link>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="glass-card p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  When someone likes, replies, or follows you, you'll see it here
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;