import { Colors } from '@/constants/colors';
import type { RequestKind, RequestTone, UserRequest } from '@/services/requests/request.api';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type Props = {
  request: UserRequest;
  compact?: boolean;
};

const REQUEST_META: Record<RequestKind, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  investment: { label: 'Investment', icon: 'trending-up-outline' },
  withdrawal: { label: 'Withdrawal', icon: 'cash-outline' },
  site_visit: { label: 'Site Visit', icon: 'calendar-outline' },
  inquiry: { label: 'Inquiry', icon: 'chatbubble-ellipses-outline' },
};

const TONE_STYLES: Record<RequestTone, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  success: { bg: 'bg-green-100', text: 'text-green-700' },
  warning: { bg: 'bg-orange-100', text: 'text-orange-700' },
  muted: { bg: 'bg-gray-100', text: 'text-gray-600' },
  error: { bg: 'bg-red-100', text: 'text-red-700' },
};

function formatDate(dateString?: string | null) {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function scheduleLine(request: UserRequest) {
  if (request.confirmedAt) return `Confirmed ${formatDate(request.confirmedAt)}`;
  if (request.scheduledAt) return `Preferred ${formatDate(request.scheduledAt)}`;
  return `Submitted ${formatDate(request.requestedAt)}`;
}

export function UserRequestCard({ request, compact = false }: Props) {
  const meta = REQUEST_META[request.kind];
  const tone = TONE_STYLES[request.tone];
  const requestedDate = formatDate(request.requestedAt);
  const schedule = scheduleLine(request);

  return (
    <View className={`bg-surface border border-border rounded-[18px] ${compact ? 'p-3' : 'p-4'} gap-3`}>
      <View className="flex-row items-start gap-3">
        <View className="w-10 h-10 rounded-[13px] bg-tag items-center justify-center">
          <Ionicons name={meta.icon} size={20} color={Colors.accentDark} />
        </View>

        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-2">
            <Text className="text-[12px] font-black uppercase text-accentDark">{meta.label}</Text>
            {requestedDate ? <Text className="text-[12px] font-semibold text-textMuted">{requestedDate}</Text> : null}
          </View>

          <Text
            className={`${compact ? 'text-[15px]' : 'text-[17px]'} font-black text-textPrimary mt-1`}
            numberOfLines={compact ? 1 : 2}
          >
            {request.title}
          </Text>

          <Text className="text-[13px] font-semibold text-textSecondary mt-1" numberOfLines={compact ? 1 : 2}>
            {request.subtitle}
          </Text>
        </View>

        <View className={`px-2.5 py-1 rounded-full ${tone.bg}`}>
          <Text className={`text-[10px] font-black uppercase ${tone.text}`}>{request.status}</Text>
        </View>
      </View>

      {!compact || request.scheduledAt || request.confirmedAt ? (
        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={15} color={Colors.textMuted} />
          <Text className="text-[13px] font-semibold text-textMuted">{schedule}</Text>
        </View>
      ) : null}

      {!compact && request.detail ? (
        <Text className="text-[13px] leading-5 font-semibold text-textSecondary" numberOfLines={2}>
          {request.detail}
        </Text>
      ) : null}
    </View>
  );
}
