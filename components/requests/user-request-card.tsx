import { Colors } from '@/constants/colors';
import type { RequestKind, RequestTone, UserRequest } from '@/services/fetchData/requests/request.api';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type Props = {
  request: UserRequest;
  compact?: boolean;
};

const REQUEST_META: Record<
  RequestKind,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  investment: {
    label: 'Investment',
    icon: 'trending-up-outline',
    iconBg: 'bg-tag',
    iconColor: Colors.accent,
    badgeBg: 'bg-tag',
    badgeText: 'text-accent',
  },
  withdrawal: {
    label: 'Withdrawal',
    icon: 'arrow-down-circle-outline',
    iconBg: 'bg-tag',
    iconColor: Colors.accent,
    badgeBg: 'bg-tag',
    badgeText: 'text-accent',
  },
  site_visit: {
    label: 'Site Visit',
    icon: 'calendar-outline',
    iconBg: 'bg-tag',
    iconColor: Colors.accent,
    badgeBg: 'bg-tag',
    badgeText: 'text-accent',
  },
  inquiry: {
    label: 'Inquiry',
    icon: 'chatbubble-ellipses-outline',
    iconBg: 'bg-tag',
    iconColor: Colors.accent,
    badgeBg: 'bg-tag',
    badgeText: 'text-accent',
  },
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
    <View className={`bg-surface border border-border rounded-[20px] ${compact ? 'p-3' : 'p-4'} gap-3 shadow-sm`}>
      <View className="flex-row items-start gap-3">
        <View className={`${compact ? 'w-10 h-10 rounded-[13px]' : 'w-12 h-12 rounded-[16px]'} ${meta.iconBg} items-center justify-center`}>
          <Ionicons name={meta.icon} size={compact ? 19 : 22} color={meta.iconColor} />
        </View>

        <View className="flex-1 min-w-0">
          <View className="flex-row flex-wrap items-center gap-2">
            <View className={`${meta.badgeBg} rounded-full px-2.5 py-1`}>
              <Text className={`text-[10px] font-black uppercase ${meta.badgeText}`}>
                {meta.label}
              </Text>
            </View>

            {requestedDate ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
                <Text className="text-[12px] font-semibold text-textMuted">{requestedDate}</Text>
              </View>
            ) : null}
          </View>

          <Text
            className={`${compact ? 'text-[15px]' : 'text-[17px]'} font-black text-textPrimary mt-2`}
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
        <View className={`${compact ? '' : 'border-t border-border pt-3'} flex-row items-center gap-2`}>
          <Ionicons name="time-outline" size={15} color={Colors.textMuted} />
          <Text className="text-[13px] font-semibold text-textMuted" numberOfLines={1}>
            {schedule}
          </Text>
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
