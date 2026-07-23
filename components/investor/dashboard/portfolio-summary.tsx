import { Colors } from '@/constants/colors';
import type { PortfolioStats } from '@/hooks/investment/use-portfolio-stats';
import { daysUntil, formatDate } from '@/utils/investor.utils';
import { Text, View } from 'react-native';
import { StatCard } from './stat-card';

export function PortfolioSummary({ stats }: { stats: PortfolioStats }) {
  const nextPayoutDays = stats.nextPayout ? daysUntil(stats.nextPayout.date) : null;

  return (
    <View className="px-4 pt-2 pb-4">
      <View className="rounded-[20px] bg-textPrimary p-5 mb-3">
        <Text className="text-white/60 text-[11px] font-bold uppercase tracking-wide">
          Total Portfolio Value
        </Text>
        <Text className="mt-1 text-white text-3xl font-black">
          ₱{stats.totalPrincipal.toLocaleString()}
        </Text>

        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-white/10">
          <View>
            <Text className="text-white/60 font-bold uppercase tracking-wide">Monthly Income</Text>
            <Text className="mt-0.5 text-white text-base font-black">
              ₱{stats.totalMonthlyPayout.toLocaleString()}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white/60 text-[11px] font-bold uppercase tracking-wide">
              Next Payout
            </Text>
            <Text className="mt-0.5 text-white text-base font-black">
              ₱{stats.nextPayout ? stats.nextPayout.amount.toLocaleString() : '—'}
            </Text>
            {nextPayoutDays !== null && (
              <Text className="text-white/60 font-semibold">
                {nextPayoutDays <= 0 ? 'Due today' : `in ${nextPayoutDays}d`}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row gap-3 mb-3">
        <StatCard
          icon="briefcase-outline"
          label="Active Plans"
          value={String(stats.activeCount)}
          accentColor={Colors.accent}
        />
        <StatCard
          icon="calendar-outline"
          label="Next Payout"
          value={stats.nextPayout ? formatDate(stats.nextPayout.date) : '—'}
          accentColor="#3B82F6"
        />
      </View>

      <View className="flex-row gap-3">
        <StatCard
          icon="checkmark-circle-outline"
          label="Total Payouts Made"
          value={String(stats.totalPayoutsMade)}
          accentColor="#22C55E"
        />
        <StatCard
          icon="time-outline"
          label="Payouts Pending"
          value={String(stats.totalPayoutsPending)}
          accentColor="#EAB308"
        />
      </View>
    </View>
  );
}