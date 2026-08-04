import { Colors } from '@/constants/colors';
import type { investment } from '@/types/investor.types';
import { formatCurrency } from '@/utils/investor.utils';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WITHDRAWAL_TYPE, WithdrawalType } from '@/services/withdrawal-requests/withdrawal-request.api';

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
  payoutMethod: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
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

function isEarnedPayout(payout: investment['investment_payouts'][number]) {
  if (payout.status === 'paid' || payout.status === 'failed') return false;
  const dueDate = new Date(payout.due_date);
  return !Number.isNaN(dueDate.getTime()) && dueDate.getTime() <= Date.now();
}

export function calculateVisibleAvailableRoi(investment: investment) {
  return (investment.investment_payouts ?? [])
    .filter(isEarnedPayout)
    .reduce((sum, payout) => sum + Number(payout.expected_amount ?? 0), 0);
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
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [notes, setNotes] = useState('');

  const availableRoi = useMemo(() => calculateVisibleAvailableRoi(investment), [investment]);
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

  const canSubmit =
    accountName.trim().length > 0 &&
    accountNumber.trim().length > 0 &&
    payoutMethod.trim().length > 0 &&
    (!isRoiWithdrawal || (amountValue > 0 && amountValue <= availableRoi)) &&
    estimatedPayout > 0;

  const submit = () => {
    if (!canSubmit || submitting) return;

    onSubmit({
      withdrawalType,
      requestedAmount: isRoiWithdrawal ? amountValue : undefined,
      payoutMethod,
      accountName,
      accountNumber,
      bankName,
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

            <Field label="Payout method" value={payoutMethod} onChangeText={setPayoutMethod} placeholder="Bank Transfer / GCash / Maya" />
            <Field label="Account name" value={accountName} onChangeText={setAccountName} placeholder="Juan Dela Cruz" />
            <Field label="Account number" value={accountNumber} onChangeText={setAccountNumber} placeholder="Account or wallet number" />
            <Field label="Bank / wallet provider" value={bankName} onChangeText={setBankName} placeholder="BDO / GCash / Maya" />
            <Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional request note" multiline />
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
