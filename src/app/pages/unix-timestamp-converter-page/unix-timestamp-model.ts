/** Conversion mode: convert a UNIX timestamp to date/time, or vice versa. */
export type ConversionMode = 'toDateTime' | 'toTimestamp';

/** Input model passed from the input card to the page component. */
export interface UnixTimestampInputModel {
  mode: ConversionMode;
  /** UNIX timestamp value (seconds or milliseconds). Used in toDateTime mode. */
  unixTimestamp?: number;
  /** Date value selected by the date picker. Used in toTimestamp mode. */
  date?: Date;
  /** Time components in hours, minutes, and seconds. Used in toTimestamp mode. */
  hours?: number;
  minutes?: number;
  seconds?: number;
  /** IANA timezone identifier (e.g. "Asia/Tokyo"). */
  timezone: string;
  /** BCP 47 language tag for locale (e.g. "ja", "en-US"). Defaults to browser locale if not specified. */
  locale?: string;
}

/** Calculated result displayed in the output grid. */
export interface UnixTimestampResult {
  localDateTime: string;
  iso8601: string;
  unixSeconds: string;
  unixMilliseconds: string;
  utcDateTime: string;
  timezoneDateTime: string;
  rfc2822: string;
  weekday: string;
}
