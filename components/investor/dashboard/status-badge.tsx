import { DEFAULT_STATUS_STYLE, InvestorStatusKey, STATUS_STYLES } from '@/constants/investor-status';
import { Text, View } from 'react-native';

type StatusBadgeProps = {
  status: string;
  small?: boolean;
};

export function StatusBadge({ status, small }: StatusBadgeProps) {
  const style = STATUS_STYLES[status?.toLowerCase() as InvestorStatusKey] ?? DEFAULT_STATUS_STYLE;

  return (
    <View className={`px-2 ${small ? 'py-0.5' : 'py-1'} rounded-full ${style.bg}`}>
      <Text className={`${small ? 'text-[10px]' : 'text-[11px]'} font-bold uppercase ${style.text}`}>
        {status}
      </Text>
    </View>
  );
}