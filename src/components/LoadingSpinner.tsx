import { MessageCircle } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary/20 border-t-primary`}></div>
          <MessageCircle className={`${sizeClasses[size]} absolute inset-0 text-primary/40`} />
        </div>
        <p className="text-muted-foreground text-sm">Loading ChirpNest...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;