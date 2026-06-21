import { Text } from 'react-native';

import { PropertySection as Section } from '@/components/property-details/property-details';

type PropertyOverviewProps = {
  description: string | null | undefined;
};

export function PropertyOverview({ description }: PropertyOverviewProps) {
  if (!description) return null;

  return (
    <Section title="Overview">
      <Text className="p-4 rounded-[20px] bg-surface border border-border text-textSecondary text-sm leading-[23px] font-semibold">
        {description}
      </Text>
    </Section>
  );
}
