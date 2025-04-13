import parseDuration from 'parse-duration';
export function parseDurationOrThrow(
  duration: string,
  format?: parseDuration.Units,
): number {
  const parsedDuration = parseDuration(duration, format);
  if (parsedDuration === null) {
    throw new Error(`Failed to parse duration: ${duration}`);
  }
  return parsedDuration;
}
