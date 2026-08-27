import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

type Review = {
  id: string;
  name: string;
  initials: string;
  rating: number; // 1-5
  quote: string;
  location?: string;
};

const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Maria Santos',
    initials: 'MS',
    rating: 5,
    quote: 'The whole reservation process was smooth. Our unit was exactly as advertised, and the team followed up every step of the way.',
    location: 'Quezon City',
  },
  {
    id: '2',
    name: 'Jerome Dela Cruz',
    initials: 'JD',
    rating: 5,
    quote: 'Investing through Reyland gave me clear payout schedules and real transparency. Best decision I made this year.',
    location: 'Cavite',
  },
  {
    id: '3',
    name: 'Angela Reyes',
    initials: 'AR',
    rating: 4,
    quote: 'Site visit was scheduled fast and the agent answered all my questions. Would definitely recommend to family.',
    location: 'Laguna',
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < rating ? 'star' : 'star-outline'}
          size={13}
          color="#F5A623"
        />
      ))}
    </View>
  );
}

const ReviewCard = React.memo(({ review }: { review: Review }) => {
  return (
    <View className="w-[260px] bg-surface rounded-[18px] border border-border p-4 me-3">
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-[38px] h-[38px] rounded-full bg-accent/15 items-center justify-center">
          <Text className="text-[13px] font-black text-accent">{review.initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[13px] font-black text-textPrimary" numberOfLines={1}>
            {review.name}
          </Text>
          {review.location ? (
            <Text className="text-[11px] font-semibold text-textMuted">{review.location}</Text>
          ) : null}
        </View>
      </View>

      <StarRow rating={review.rating} />

      <Text className="mt-2 text-[13px] leading-[19px] font-semibold text-textSecondary" numberOfLines={4}>
        {review.quote}
      </Text>
    </View>
  );
});

export function CustomerReviews() {
  return (
    <View className="mt-[15px] mb-[50px]">
      <View className="mx-[18px] mb-[15px]">
        <Text className="text-[23px] font-semibold tracking-[-0.7px]">Satisfied Customers</Text>
        <Text className="mt-1 text-[13px] font-semibold text-textMuted">
          What buyers and investors say about Reyland
        </Text>
      </View>

      <ScrollView
        horizontal
        contentInsetAdjustmentBehavior="never"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18 }}
      >
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>
    </View>
  );
}