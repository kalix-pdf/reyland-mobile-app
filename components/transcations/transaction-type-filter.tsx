import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export type TransactionTypeFilter = 'all' | 0 | 1 | 2;

export type TransactionTypeCounts = {
  all: number;
  purchase: number;
  investment: number;
  withdrawal: number;
};

interface FilterOption {
  value: TransactionTypeFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  countKey: keyof TransactionTypeCounts;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All', icon: 'apps-outline', countKey: 'all' },
  { value: 0, label: 'Purchase', icon: 'home-outline', countKey: 'purchase' },
  { value: 1, label: 'Investment', icon: 'trending-up-outline', countKey: 'investment' },
  { value: 2, label: 'Withdrawal', icon: 'arrow-down-circle-outline', countKey: 'withdrawal' },
];

interface TransactionTypeFilterProps {
  selected: TransactionTypeFilter;
  onSelect: (value: TransactionTypeFilter) => void;
  counts?: TransactionTypeCounts;
}

export function TransactionTypeFilterBar({ selected, onSelect, counts }: TransactionTypeFilterProps) {
  return (
    <View className="pb-4">
      <Text className="mb-2 text-[12px] font-black uppercase text-textSecondary">
        Transaction type
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => {
            const isActive = selected === option.value;
            const count = counts?.[option.countKey] ?? 0;
            return (
            <Pressable
                key={String(option.value)}
                onPress={() => onSelect(option.value)}
                className={`min-h-[38px] flex-row items-center gap-1.5 rounded-[15px] border px-3 ${
                isActive ? 'bg-primary border-primary' : 'bg-surface border-border'
                }`}
            >
                <Ionicons
                  name={option.icon}
                  size={14}
                  color={isActive ? Colors.textOnDark : Colors.accent}
                />
                <Text className={`text-[12px] font-black ${isActive ? 'text-textOnDark' : 'text-textSecondary'}`}>
                {option.label}
                </Text>
                <View
                  className={`min-w-[22px] rounded-full px-1.5 py-0.5 ${
                    isActive ? 'bg-textOnDark/15' : 'bg-surfaceMuted'
                  }`}
                >
                  <Text
                    className={`text-center text-[10px] font-black ${
                      isActive ? 'text-textOnDark' : 'text-textMuted'
                    }`}
                  >
                    {count}
                  </Text>
                </View>
            </Pressable>
            );
        })}
      </View>
    </View>
  );
}
