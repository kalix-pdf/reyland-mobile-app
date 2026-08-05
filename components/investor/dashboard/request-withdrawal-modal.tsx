import { Colors } from '@/constants/colors';
import { usePaymentMethods } from '@/hooks/payment-method/usePaymentMethods';
import { WITHDRAWAL_TYPE, WithdrawalType } from '@/services/withdrawal-requests/withdrawal-request.api';
import type { investment } from '@/types/investor.types';
import type { PaymentMethod } from '@/types/payment.types';
import { formatCurrency } from '@/utils/investor.utils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RequestWithdrawalModalProps = {
  visible: boolean;
  investment: investment;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: WithdrawalRequestFormPayload) => void;
};

export type WithdrawalRequestFormPayload = {
  withdrawalType: WithdrawalType;
  requestedAmount?: number;
  paymentMethodId: string;
  notes: string;
};

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'decimal-pad';
  multiline?: boolean;
};

function Field({ label, value, placeholder, onChangeText, keyboardType = 'default', multiline = false }: FieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-black uppercase text-textSecondary">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        className={`rounded-[14px] border border-border bg-surface px-3.5 py-3 text-[14px] font-semibold text-textPrimary ${
          multiline ? 'min-h-[86px]' : ''
        }`}
        style={multiline ? { textAlignVertical: 'top' } : undefined}
      />
    </View>
  );
}

function parseAmount(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function maskAccountNumber(value: string) {
  return `•••• ${value.slice(-4)}`;
}

function getMethodLabel(method: PaymentMethod) {
  const provider = method.provider_name ?? 'Payout Method';
  return `${provider} - ${maskAccountNumber(method.account_number)}`;
}

// function isEarnedPayout(payout: investment['investment_payouts'][number]) {
//   if (payout.status === 'paid' || payout.status === 'failed') return false;
//   const dueDate = new Date(payout.due_date);
//   return !Number.isNaN(dueDate.getTime()) && dueDate.getTime() <= Date.now();
// }


export function calculateVisibleAvailableRoi(investment: investment) {

  const totalPayoutsReceived = (investment.investment_payouts ?? []).reduce((sum, payout) =>
    sum + (payout.status === 'paid' ? Number(payout.paid_amount ?? 0) : 0), 0);

  const totalROI = investment.locked_investment ? totalPayoutsReceived + Number(investment.bonus_paid ?? 0)
    : totalPayoutsReceived;
  return totalROI;
  // return (investment.investment_payouts ?? [])
  //   .filter(isEarnedPayout)
  //   .reduce((sum, payout) => sum + Number(payout.expected_amount ?? 0), 0);
}

export function RequestWithdrawalModal({
  visible,
  investment,
  submitting,
  onClose,
  onSubmit,
}: RequestWithdrawalModalProps) {
  const [withdrawalType, setWithdrawalType] = useState<WithdrawalType>(WITHDRAWAL_TYPE.ROI_ONLY);
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const { methods, loading: methodsLoading, error: methodsError, refresh: refreshMethods } = usePaymentMethods();

  const availableRoi = useMemo(() => calculateVisibleAvailableRoi(investment), [investment]);
  const selectedPaymentMethod = useMemo(
    () => methods.find((method) => method.id === selectedPaymentMethodId) ?? null,
    [methods, selectedPaymentMethodId],
  );
  const amountValue = parseAmount(amount);
  const isRoiWithdrawal = withdrawalType === WITHDRAWAL_TYPE.ROI_ONLY;
  const estimatedPayout = isRoiWithdrawal
    ? amountValue
    : Number(investment.principal_amount ?? 0) + availableRoi;

  const amountError =
    isRoiWithdrawal && amountValue > availableRoi
      ? 'Amount cannot exceed available ROI.'
      : isRoiWithdrawal && amount.trim().length > 0 && amountValue <= 0
        ? 'Enter an amount greater than zero.'
        : null;

  useEffect(() => {
    if (!visible || selectedPaymentMethodId || methods.length === 0) return;

    const defaultMethod = methods.find((method) => method.is_default) ?? methods[0];
    setSelectedPaymentMethodId(defaultMethod.id);
  }, [methods, selectedPaymentMethodId, visible]);

  const canSubmit =
    Boolean(selectedPaymentMethodId) &&
    (!isRoiWithdrawal || (amountValue > 0 && amountValue <= availableRoi)) &&
    estimatedPayout > 0;

  const submit = () => {
    if (!canSubmit || submitting || !selectedPaymentMethodId) return;

    onSubmit({
      withdrawalType,
      requestedAmount: isRoiWithdrawal ? amountValue : undefined,
      paymentMethodId: selectedPaymentMethodId,
      notes,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/[0.42]" onPress={onClose} />

        <SafeAreaView edges={['bottom']} className="max-h-[92%] rounded-t-[26px] bg-background">
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <View>
              <Text className="text-lg font-black text-textPrimary">Request Withdrawal</Text>
              <Text className="mt-1 text-[13px] font-semibold text-textMuted">{investment.investment_ref}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} className="w-9 h-9 rounded-full items-center justify-center bg-surface">
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView className="px-5" contentContainerClassName="gap-4 pb-4" keyboardShouldPersistTaps="handled">
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setWithdrawalType(WITHDRAWAL_TYPE.ROI_ONLY)}
                className={`flex-1 rounded-[16px] border p-3 ${
                  isRoiWithdrawal ? 'border-accent bg-tag' : 'border-border bg-surface'
                }`}
              >
                <Text className="text-[13px] font-black text-textPrimary">ROI Withdrawal</Text>
                <Text className="mt-1 text-[11px] leading-4 font-semibold text-textSecondary">
                  Withdraw part or all available ROI.
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setWithdrawalType(WITHDRAWAL_TYPE.FULL_INVESTMENT)}
                className={`flex-1 rounded-[16px] border p-3 ${
                  !isRoiWithdrawal ? 'border-accent bg-tag' : 'border-border bg-surface'
                }`}
              >
                <Text className="text-[13px] font-black text-textPrimary">Full Investment</Text>
                <Text className="mt-1 text-[11px] leading-4 font-semibold text-textSecondary">
                  Withdraw principal plus available ROI.
                </Text>
              </Pressable>
            </View>

            <View className="rounded-[16px] border border-border bg-surface p-4 gap-2">
              <View className="flex-row justify-between">
                <Text className="text-[13px] font-semibold text-textSecondary">Principal</Text>
                <Text className="text-[13px] font-black text-textPrimary">{formatCurrency(investment.principal_amount)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[13px] font-semibold text-textSecondary">Available ROI</Text>
                <Text className="text-[13px] font-black text-textPrimary">{formatCurrency(availableRoi)}</Text>
              </View>
              <View className="flex-row justify-between border-t border-border pt-2">
                <Text className="text-[13px] font-black text-textPrimary">Estimated Payout</Text>
                <Text className="text-[15px] font-black text-accent">{formatCurrency(estimatedPayout)}</Text>
              </View>
            </View>

            {isRoiWithdrawal ? (
              <View>
                <Field
                  label="ROI amount"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
                <View className="flex-row gap-2 mt-2">
                  {[25, 50, 100].map((percent) => (
                    <Pressable
                      key={percent}
                      onPress={() => setAmount(String(Math.floor((availableRoi * percent) / 100)))}
                      className="rounded-full border border-border bg-surface px-3 py-1.5"
                    >
                      <Text className="text-[11px] font-black text-textSecondary">{percent === 100 ? 'Max' : `${percent}%`}</Text>
                    </Pressable>
                  ))}
                </View>
                {amountError ? <Text className="mt-1.5 text-[12px] font-bold text-error">{amountError}</Text> : null}
              </View>
            ) : (
              <View className="rounded-[16px] border border-amber-200 bg-amber-50 p-3">
                <Text className="text-[13px] leading-5 font-semibold text-amber-800">
                  Full investment withdrawal closes this investment after payout. Future ROI will stop after the request is paid.
                </Text>
              </View>
            )}

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] font-black uppercase text-textSecondary">Preferred payout method</Text>
                <Pressable
                  onPress={() => {
                    onClose();
                    router.push('/payment-method');
                  }}
                >
                  <Text className="text-[12px] font-black text-accent">Manage</Text>
                </Pressable>
              </View>

              {methodsLoading ? (
                <View className="rounded-[16px] border border-border bg-surface p-4">
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color={Colors.accent} />
                    <Text className="text-[13px] font-semibold text-textSecondary">Loading saved methods...</Text>
                  </View>
                </View>
              ) : methodsError ? (
                <Pressable onPress={refreshMethods} className="rounded-[16px] border border-errorBorder bg-errorBackground p-4">
                  <Text className="text-[13px] font-black text-error">Unable to load payout methods</Text>
                  <Text className="mt-1 text-[12px] font-semibold text-error">Tap to retry.</Text>
                </Pressable>
              ) : methods.length === 0 ? (
                <Pressable
                  onPress={() => {
                    onClose();
                    router.push('/payment-method');
                  }}
                  className="rounded-[16px] border border-dashed border-border bg-surface p-4"
                >
                  <Text className="text-[14px] font-black text-textPrimary">Add a payout method</Text>
                  <Text className="mt-1 text-[12px] leading-4 font-semibold text-textSecondary">
                    Add your preferred bank or e-wallet first. Our team may still confirm details by email before processing.
                  </Text>
                </Pressable>
              ) : (
                <View className="gap-2">
                  {methods.map((method) => {
                    const selected = selectedPaymentMethodId === method.id;

                    return (
                      <Pressable
                        key={method.id}
                        onPress={() => setSelectedPaymentMethodId(method.id)}
                        className={`rounded-[16px] border p-3 ${
                          selected ? 'border-accent bg-tag' : 'border-border bg-surface'
                        }`}
                      >
                        <View className="flex-row items-center justify-between gap-3">
                          <View className="flex-1 min-w-0">
                            <Text className="text-[14px] font-black text-textPrimary" numberOfLines={1}>
                              {getMethodLabel(method)}
                            </Text>
                            <Text className="mt-1 text-[12px] font-semibold text-textSecondary" numberOfLines={1}>
                              {method.account_name ?? 'Account name not set'}{method.is_default ? ' • Default' : ''}
                            </Text>
                          </View>
                          <Ionicons
                            name={selected ? 'radio-button-on' : 'radio-button-off'}
                            size={20}
                            color={selected ? Colors.accent : Colors.textMuted}
                          />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {selectedPaymentMethod ? (
                <Text className="text-[12px] leading-4 font-semibold text-textMuted">
                  Selected details are saved with the request. Final payout coordination can continue through email.
                </Text>
              ) : null}
            </View>
            {/* <Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional request note" multiline /> */}
          </ScrollView>

          <View className="border-t border-border px-5 pt-3 pb-5">
            <Pressable
              onPress={submit}
              disabled={!canSubmit || submitting}
              className={`min-h-[50px] items-center justify-center rounded-2xl ${
                !canSubmit || submitting ? 'bg-border opacity-70' : 'bg-accent active:opacity-80'
              }`}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.textOnDark} />
              ) : (
                <Text className="text-[14px] font-black text-textOnDark">Submit Withdrawal Request</Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
