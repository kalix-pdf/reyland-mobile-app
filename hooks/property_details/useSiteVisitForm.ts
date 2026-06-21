import { useEffect, useState } from 'react';

import {
  addSiteVisit,
  fetchActivePropertySiteVisit,
  SiteVisitApiError,
} from '@/services/site-visits/site-visit.api';
import { createVisitDateTimeISO, isValidPhMobilePhone } from '@/utils/property-details.utils';
import type { VisitDateParts, VisitTimeParts } from '@/types/property-details.types';

type UseSiteVisitFormArgs = {
  propertyId: number;
  userUuid?: string;
};

type SubmitOutcome =
  | { status: 'success' }
  | { status: 'already_active' }
  | { status: 'error'; message: string };

type SubmitArgs = {
  name: string;
  email: string;
  phone: string;
  visitDate: VisitDateParts;
  visitTime: VisitTimeParts;
  visitDateLabel: string;
  visitTimeLabel: string;
};

export function useSiteVisitForm({ propertyId, userUuid }: UseSiteVisitFormArgs) {
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingActiveVisit, setCheckingActiveVisit] = useState(false);
  const [hasActiveVisit, setHasActiveVisit] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkActiveSiteVisit = async () => {
      if (!propertyId || !userUuid) {
        setHasActiveVisit(false);
        return;
      }

      try {
        setCheckingActiveVisit(true);
        const activeSiteVisit = await fetchActivePropertySiteVisit(propertyId);
        if (!cancelled) setHasActiveVisit(Boolean(activeSiteVisit));
      } catch {
        if (!cancelled) setHasActiveVisit(false);
      } finally {
        if (!cancelled) setCheckingActiveVisit(false);
      }
    };

    checkActiveSiteVisit();

    return () => {
      cancelled = true;
    };
  }, [propertyId, userUuid]);

  const validate = ({ name, phone, visitDateLabel, visitTimeLabel }: SubmitArgs): string | null => {
    if (hasActiveVisit) {
      return 'You already have an active site visit request for this property. Our team will contact you soon.';
    }
    if (!name.trim()) {
      return 'Please enter your name so our team knows who to expect.';
    }
    if (!phone.trim()) {
      return 'Please enter your mobile number.';
    }
    if (phone.trim() && !isValidPhMobilePhone(phone.trim())) {
      return 'Please enter a valid Philippine mobile number like 09171234567 or +639171234567.';
    }
    if (!visitDateLabel.trim()) {
      return 'Please enter your preferred visit date.';
    }
    if (!visitTimeLabel.trim()) {
      return 'Please enter your preferred visit time.';
    }
    return null;
  };

  const submit = async (args: SubmitArgs): Promise<SubmitOutcome> => {
    const validationError = validate(args);
    if (validationError) {
      return { status: 'error', message: validationError };
    }

    try {
      setSubmitting(true);

      await addSiteVisit({
        property_id: propertyId,
        name: args.name.trim(),
        email: args.email.trim() || null,
        phone: args.phone.trim(),
        preferred_visit_at: createVisitDateTimeISO(args.visitDate, args.visitTime),
        notes: notes.trim() || null,
      });

      setHasActiveVisit(true);
      return { status: 'success' };
    } catch (error) {
      if (error instanceof SiteVisitApiError && error.statusCode === 409) {
        setHasActiveVisit(true);
        return { status: 'already_active' };
      }

      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Please try again in a moment.',
      };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    notes,
    setNotes,
    submitting,
    checkingActiveVisit,
    hasActiveVisit,
    submit,
  };
}
