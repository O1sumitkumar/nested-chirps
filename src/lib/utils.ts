import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatChirpDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const chirpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Format time as HH:MM AM/PM
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  if (chirpDate.getTime() === today.getTime()) {
    // Today - show only time
    return timeString;
  } else if (chirpDate.getTime() === yesterday.getTime()) {
    // Yesterday - show "Yesterday" with time
    return `Yesterday • ${timeString}`;
  } else {
    // Older posts - show date and time
    const dateString = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long'
    });
    return `${dateString} • ${timeString}`;
  }
}
