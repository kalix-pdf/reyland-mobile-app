import { Pressable, ScrollView, Text, View } from 'react-native';

export type TransactionTypeFilter = 'all' | 0 | 1 | 2;

interface FilterOption {
  value: TransactionTypeFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 0, label: 'Purchase' },
  { value: 1, label: 'Investment' },
  { value: 2, label: 'Withdrawal' },
];

interface TransactionTypeFilterProps {
  selected: TransactionTypeFilter;
  onSelect: (value: TransactionTypeFilter) => void;
}

export function TransactionTypeFilterBar({ selected, onSelect }: TransactionTypeFilterProps) {
  return (
    <View className="px-5 pt-2 pb-3">
        <View className="flex-row flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => {
            const isActive = selected === option.value;
            return (
            <Pressable
                key={String(option.value)}
                onPress={() => onSelect(option.value)}
                className={`px-4 py-1.5 rounded-full border ${
                isActive ? 'bg-primary border-primary' : 'bg-surface border-border'
                }`}
            >
                <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-textSecondary'}`}>
                {option.label}
                </Text>
            </Pressable>
            );
        })}
        </View>
    </View>
  );
}