import { sub } from "date-fns";

export const oneSecondInMs = 1000;
export const oneMinInMs = 60 * oneSecondInMs;
export const oneHourInMs = 60 * oneMinInMs;
export const twentyFourHoursInMs = 24 * oneHourInMs;
export const twentyFourHoursInSecs = twentyFourHoursInMs / oneSecondInMs;
export const oneYearInSecs = twentyFourHoursInSecs * 365;

export function toJsTimestamp(unixTimestamp: number): number {
  return unixTimestamp * oneSecondInMs;
}

export function toUtcTime(date: Date) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

export function getPreviousThursday(date: Date = new Date()): Date {
  let daysSinceThursday = date.getDay() - 4;
  if (daysSinceThursday < 0) daysSinceThursday += 7;

  return sub(date, {
    days: daysSinceThursday,
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  });
}

export function parseDate(date: string) {
  return (toUtcTime(new Date(date)) / 1000).toString();
}

export function dateTimeLabelFor(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
