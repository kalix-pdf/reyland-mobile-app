export type GalleryImage = {
  id: string;
  image_url: string;
  public_id?: string;
};

export type VisitDateParts = {
  month: number;
  day: number;
  year: number;
};

export type VisitTimeParts = {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
};

export type SchedulePickerKind = 'date' | 'time' | null;

export type InquiryFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type SiteVisitFormValues = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

/**
 * Generic config for a single scrollable wheel-picker column.
 * `T` is the value type the column resolves to (number | string | union).
 */
export type WheelPickerColumnConfig<T extends string | number> = {
  key: string;
  options: readonly T[];
  selectedValue: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
};
