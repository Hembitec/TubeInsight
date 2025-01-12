/**
 * Formats a YouTube duration string (ISO 8601) into a human-readable format
 * @param duration ISO 8601 duration string (e.g., "PT1H2M10S")
 * @returns formatted duration string (e.g., "1:02:10")
 */
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const [, hours, minutes, seconds] = match;
  const h = parseInt(hours || '0');
  const m = parseInt(minutes || '0');
  const s = parseInt(seconds || '0');

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string
 * @returns formatted date string (e.g., "Jan 12, 2024")
 */
export function formatPublishDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
