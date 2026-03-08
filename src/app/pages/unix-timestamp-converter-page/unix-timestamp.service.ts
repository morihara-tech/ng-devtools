import { Injectable } from '@angular/core';
import { UnixTimestampInputModel, UnixTimestampResult } from './unix-timestamp-model';

/** Threshold to distinguish seconds (10 digits) from milliseconds (13 digits). */
const MILLISECONDS_THRESHOLD = 9_999_999_999;

/** Day-of-week abbreviations for RFC 2822 formatting. */
const RFC2822_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Month abbreviations for RFC 2822 formatting. */
const RFC2822_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

@Injectable({
  providedIn: 'root',
})
export class UnixTimestampService {
  /**
   * Converts the given input model to a UnixTimestampResult.
   * Returns null if the input is insufficient.
   */
  convert(input: UnixTimestampInputModel): UnixTimestampResult | null {
    const date = this.resolveDate(input);
    if (!date || isNaN(date.getTime())) {
      return null;
    }
    return this.buildResult(date, input.timezone, input.locale);
  }

  private resolveDate(input: UnixTimestampInputModel): Date | null {
    if (input.mode === 'toDateTime') {
      if (input.unixTimestamp === undefined || input.unixTimestamp === null) {
        return null;
      }
      return this.unixToDate(input.unixTimestamp);
    }

    if (!input.date) {
      return null;
    }

    const d = new Date(input.date);
    d.setHours(input.hours ?? 0, input.minutes ?? 0, input.seconds ?? 0, 0);
    return d;
  }

  /**
   * Determines whether the value is in seconds or milliseconds by digit count
   * and converts it to a Date object accordingly.
   */
  private unixToDate(timestamp: number): Date {
    const isMilliseconds = Math.abs(timestamp) > MILLISECONDS_THRESHOLD;
    return new Date(isMilliseconds ? timestamp : timestamp * 1000);
  }

  private buildResult(date: Date, timezone: string, locale?: string): UnixTimestampResult {
    const unixMs = date.getTime();
    const unixSeconds = Math.floor(unixMs / 1000);
    const resolvedLocale = locale || undefined;

    return {
      localDateTime: new Intl.DateTimeFormat(resolvedLocale, {
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(date),
      iso8601: date.toISOString(),
      unixSeconds: unixSeconds.toString(),
      unixMilliseconds: unixMs.toString(),
      utcDateTime: new Intl.DateTimeFormat(resolvedLocale, {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'UTC',
      }).format(date),
      timezoneDateTime: new Intl.DateTimeFormat(resolvedLocale, {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: timezone,
      }).format(date),
      rfc2822: this.toRfc2822(date),
      weekday: new Intl.DateTimeFormat(resolvedLocale, {
        weekday: 'long',
      }).format(date),
    };
  }

  /**
   * Formats a Date to the RFC 2822 string representation
   * (e.g. "Sun, 08 Mar 2026 01:37:22 +0900") using the local timezone offset.
   */
  private toRfc2822(date: Date): string {
    const day = RFC2822_DAYS[date.getDay()];
    const d = date.getDate().toString().padStart(2, '0');
    const month = RFC2822_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const tzOffsetMinutes = -date.getTimezoneOffset();
    const tzSign = tzOffsetMinutes >= 0 ? '+' : '-';
    const tzHours = Math.floor(Math.abs(tzOffsetMinutes) / 60).toString().padStart(2, '0');
    const tzMins = (Math.abs(tzOffsetMinutes) % 60).toString().padStart(2, '0');

    return `${day}, ${d} ${month} ${year} ${hours}:${minutes}:${seconds} ${tzSign}${tzHours}${tzMins}`;
  }
}
