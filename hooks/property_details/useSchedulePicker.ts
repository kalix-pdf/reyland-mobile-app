import { useState } from 'react';

import { createInitialVisitDateParts, createInitialVisitTimeParts, formatVisitDate, formatVisitTime, clampDateParts,} from '@/utils/property-details.utils';
import type { SchedulePickerKind, VisitDateParts, VisitTimeParts } from '@/types/property-details.types';

type UseSchedulePickerResult = {
  /** Which picker (date/time/none) is currently open in the modal. */
  activePicker: SchedulePickerKind;
  /** Committed values, reflected in the visible "Select date" / "Select time" buttons. */
  committedDate: VisitDateParts;
  committedTime: VisitTimeParts;
  visitDateLabel: string;
  visitTimeLabel: string;
  /** Draft values, mutated live as the user scrolls, discarded on cancel. */
  draftDate: VisitDateParts;
  draftTime: VisitTimeParts;
  openDatePicker: () => void;
  openTimePicker: () => void;
  updateDraftDate: (next: Partial<VisitDateParts>) => void;
  updateDraftTime: (next: Partial<VisitTimeParts>) => void;
  confirmPicker: () => void;
  cancelPicker: () => void;
};

/**
 * Manages the date+time scheduling picker as a draft/commit flow:
 * opening the modal seeds a draft copy, scrolling mutates the draft only,
 * and "Confirm" commits the draft back into the visible selection.
 */
export function useSchedulePicker(): UseSchedulePickerResult {
  const [activePicker, setActivePicker] = useState<SchedulePickerKind>(null);

  const [committedDate, setCommittedDate] = useState<VisitDateParts>(createInitialVisitDateParts);
  const [committedTime, setCommittedTime] = useState<VisitTimeParts>(createInitialVisitTimeParts);
  const [visitDateLabel, setVisitDateLabel] = useState('');
  const [visitTimeLabel, setVisitTimeLabel] = useState('');

  const [draftDate, setDraftDate] = useState<VisitDateParts>(createInitialVisitDateParts);
  const [draftTime, setDraftTime] = useState<VisitTimeParts>(createInitialVisitTimeParts);

  const openDatePicker = () => {
    setDraftDate(committedDate);
    setActivePicker('date');
  };

  const openTimePicker = () => {
    setDraftTime(committedTime);
    setActivePicker('time');
  };

  const updateDraftDate = (next: Partial<VisitDateParts>) => {
    setDraftDate((current) => clampDateParts({ ...current, ...next }));
  };

  const updateDraftTime = (next: Partial<VisitTimeParts>) => {
    setDraftTime((current) => ({ ...current, ...next }));
  };

  const confirmPicker = () => {
    if (activePicker === 'date') {
      setCommittedDate(draftDate);
      setVisitDateLabel(formatVisitDate(draftDate));
    }

    if (activePicker === 'time') {
      setCommittedTime(draftTime);
      setVisitTimeLabel(formatVisitTime(draftTime));
    }

    setActivePicker(null);
  };

  const cancelPicker = () => setActivePicker(null);

  return {
    activePicker,
    committedDate,
    committedTime,
    visitDateLabel,
    visitTimeLabel,
    draftDate,
    draftTime,
    openDatePicker,
    openTimePicker,
    updateDraftDate,
    updateDraftTime,
    confirmPicker,
    cancelPicker,
  };
}
