import { Dimensions } from 'react-native';

export const PROPERTY_SCREEN_WIDTH = Dimensions.get('window').width;
export const CAROUSEL_HEIGHT = 450;
export const WHEEL_PICKER_OPTION_HEIGHT = 42;
export const WHEEL_PICKER_VISIBLE_HEIGHT = 178;

export const PROPERTY_STATUS_LABELS: Record<number, string> = {
  0: 'Available',
  1: 'Sold',
  2: 'Reserved',
};

export const LOT_TYPE_LABELS: Record<number, string> = {
  0: 'Regular Lot',
  1: 'Corner Lot',
};

export const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const TIME_PERIOD_OPTIONS = ['AM', 'PM'] as const;

export const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

export const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) => index * 5);

/** Number of upcoming years to offer in the date picker (current year + N). */
export const VISIT_YEAR_RANGE = 6;

export const PH_MOBILE_PHONE_REGEX = /^[+()\d\s-]{7,20}$/;
