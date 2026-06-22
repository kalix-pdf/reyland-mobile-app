import { useEffect, useState } from 'react';

import {
  addInquiry,
  fetchActivePropertyInquiry,
  InquiryApiError,
} from '@/services/inquiries/inquiry.api';
import { isValidPhMobilePhone } from '@/utils/property-details.utils';

type FormError = { type: 'network' | 'server' | 'validation'; message: string } | null;

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
  | { status: 'network_error'; message: string }
  | { status: 'server_error'; message: string }
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
  const [formError, setFormError] = useState<FormError>(null);

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
    setFormError(null); // clear stale error on retry

    if (!trimmedName) {
      const err = { type: 'validation' as const, message: 'Please enter your name so our team knows who to contact.' };
      setFormError(err);
      return { status: 'error', message: err.message };
    }
    if (!trimmedPhone) {
      const err = { type: 'validation' as const, message: 'Please enter your mobile number.' };
      setFormError(err);
      return { status: 'error', message: err.message };
    }
    if (phoneIsInvalid) {
      const err = {
        type: 'validation' as const,
        message: 'Please enter a valid Philippine mobile number like 09171234567 or +639171234567.',
      };
      setFormError(err);
      return { status: 'error', message: err.message };
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

      if (error instanceof InquiryApiError) {
        const err = { type: 'server' as const, message: error.message || 'Something went wrong on our end. Please try again.' };
        setFormError(err);
        return { status: 'server_error', message: err.message };
      }

      if (error instanceof TypeError) {
        const err = { type: 'network' as const, message: 'No internet connection. Please check your network and try again.' };
        setFormError(err);
        return { status: 'network_error', message: err.message };
      }

      const err = { type: 'server' as const, message: error instanceof Error ? error.message : 'Please try again in a moment.' };
      setFormError(err);
      return { status: 'error', message: err.message };
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
    formError,
    clearError: () => setFormError(null),
    submit,
  };
}
