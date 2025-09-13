import { useState } from "react";
import { useBookmarkedChirps } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/selectors";
import Header from "@/components/Header";
import ChirpCard from "@/components/ChirpCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Bookmark, BookmarkCheck } from "lucide-react";

const Bookmarks = () => {
  const user = useAppSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<'all' | 'media'>('all');
  
  const { data: bookmarkedChirps, isLoading, error } = useBookmarkedChirps(user?.id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto pt-20">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto pt-20 px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load bookmarks</p>
          </div>
        </main>
      </div>
    );
  }

  // Ensure bookmarkedChirps is always an array
  const chirpsArray = Array.isArray(bookmarkedChirps) ? bookmarkedChirps : [];
  
  const filteredChirps = activeTab === 'media' 
    ? chirpsArray.filter(chirp => chirp.mediaUrl) 
    : chirpsArray;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto pt-20 px-4">
        {/* Header Section */}
        <div className="border-b border-border/40 pb-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookmarkCheck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            {chirpsArray.length} bookmarked chirps
          </p>
          
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'media'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Media
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredChirps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === 'media' ? 'No media bookmarks yet' : 'No bookmarks yet'}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              {activeTab === 'media' 
                ? 'Start bookmarking chirps with photos and videos to see them here.'
                : 'Start bookmarking chirps to save them for later reading.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChirps.map((chirp) => (
              <ChirpCard key={chirp.id || chirp._id} {...chirp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;