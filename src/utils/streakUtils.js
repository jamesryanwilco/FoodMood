import { parseISO, differenceInCalendarDays } from 'date-fns';

export const calculateStreak = (completedEntries) => {
  if (!completedEntries || completedEntries.length === 0) {
    return 0;
  }

  // Get unique dates and sort them descending
  const uniqueDates = [...new Set(completedEntries.map(e => e.date.split('T')[0]))];
  const sortedDates = uniqueDates.map(d => parseISO(d)).sort((a, b) => b - a);

  if (sortedDates.length === 0) {
    return 0;
  }
  
  let streak = 0;
  const today = new Date();
  const mostRecentEntryDate = sortedDates[0];

  // Streak can only exist if last entry was today or yesterday
  if (differenceInCalendarDays(today, mostRecentEntryDate) <= 1) {
    streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const dayDiff = differenceInCalendarDays(sortedDates[i-1], sortedDates[i]);
      if (dayDiff === 1) {
        streak++;
      } else {
        break; // Streak is broken
      }
    }
  }
  
  return streak;
}; 