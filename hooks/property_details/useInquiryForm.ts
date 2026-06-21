import { useEffect, useState } from 'react';

import {
  addInquiry,
  fetchActivePropertyInquiry,
  InquiryApiError,
} from '@/services/inquiries/inquiry.api';
import { isValidPhMobilePhone } from '@/utils/property-details.utils';

type UseInquiryFormArgs = {
  propertyId: number;
  propertyTitle: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  userUuid?: string;
};

type SubmitOutcome =
  | { status: 'success' }
  | { status: 'already_active' }
  | { status: 'error'; message: string };

export function useInquiryForm({
  propertyId,
  propertyTitle,
  defaultName = '',
  defaultEmail = '',
  defaultPhone = '',
  userUuid,
}: UseInquiryFormArgs) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState(`Hi, I would like to inquire about ${propertyTitle}.`);

  const [submitting, setSubmitting] = useState(false);
  const [checkingActiveInquiry, setCheckingActiveInquiry] = useState(false);
  const [hasActiveInquiry, setHasActiveInquiry] = useState(false);

  // Re-seed defaults when the signed-in user or property title becomes available/changes.
  useEffect(() => {
    setName(defaultName);
    setEmail(defaultEmail);
    setPhone(defaultPhone);
  }, [defaultName, defaultEmail, defaultPhone]);

  useEffect(() => {
    setMessage(`Hi, I would like to inquire about ${propertyTitle}.`);
  }, [propertyTitle]);

  useEffect(() => {
    let cancelled = false;

    const checkActiveInquiry = async () => {
      if (!propertyId || !userUuid) {
        setHasActiveInquiry(false);
        return;
      }

      try {
        setCheckingActiveInquiry(true);
        const activeInquiry = await fetchActivePropertyInquiry(propertyId);
        if (!cancelled) setHasActiveInquiry(Boolean(activeInquiry));
      } catch {
        if (!cancelled) setHasActiveInquiry(false);
      } finally {
        if (!cancelled) setCheckingActiveInquiry(false);
      }
    };

    checkActiveInquiry();

    return () => {
      cancelled = true;
    };
  }, [propertyId, userUuid]);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();
  const phoneIsInvalid = trimmedPhone.length > 0 && !isValidPhMobilePhone(trimmedPhone);

  const isSubmitDisabled =
    submitting || trimmedName.length === 0 || trimmedPhone.length === 0 || phoneIsInvalid;

  const submit = async (): Promise<SubmitOutcome> => {
    if (!trimmedName) {
      return { status: 'error', message: 'Please enter your name so our team knows who to contact.' };
    }
    if (!trimmedPhone) {
      return { status: 'error', message: 'Please enter your mobile number.' };
    }
    if (phoneIsInvalid) {
      return {
        status: 'error',
        message: 'Please enter a valid Philippine mobile number like 09171234567 or +639171234567.',
      };
    }

    try {
      setSubmitting(true);

      await addInquiry({
        property_id: propertyId,
        name: trimmedName,
        email: trimmedEmail || null,
        phone: trimmedPhone || null,
        message: message.trim() || null,
      });

      setHasActiveInquiry(true);
      return { status: 'success' };
    } catch (error) {
      if (error instanceof InquiryApiError && error.statusCode === 409) {
        setHasActiveInquiry(true);
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
    values: { name, email, phone, message },
    setters: { setName, setEmail, setPhone, setMessage },
    submitting,
    checkingActiveInquiry,
    hasActiveInquiry,
    isSubmitDisabled,
    phoneIsInvalid,
    submit,
  };
}
