import AppColors from '@/tailwind.colors';
import type { Project } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  project: Project;
};

function ProjectCard({ project }: Props) {
  const player = useVideoPlayer(project.video_url, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  const router = useRouter();
  const location = project.location?.trim() || 'Location unavailable';
  const completionLabel = project.date_completed?.trim() || 'Completion TBA';

  return (
    <Pressable
      className="bg-surface rounded-[20px] mx-[18px] mb-3.5 border border-border shadow-sm overflow-hidden active:opacity-90 active:scale-[0.985]"
      onPress={() =>
        router.push({
          pathname: '/project-property/[id]',
          params: {
            id: project.id.toString(),
            name: project.project_name,
          },
        })
      }
    >

      <View pointerEvents="none">
        <VideoView
          player={player}
          contentFit="cover"
          style={{
            backgroundColor: AppColors.border,
            aspectRatio: 16 / 9,
          }}
          nativeControls={false}
        />
      </View>

      <View className="absolute top-3.5 left-3.5 right-3.5 flex-row justify-between gap-2">
        {project.is_featured ? (
          <View className="flex-row items-center gap-1 px-[11px] py-1.5 rounded-full bg-tag">
            <Ionicons name="star" size={11} color={AppColors.accent} />
            <Text className="text-accent text-[11px] font-black">Featured</Text>
          </View>
        ) : null}
      </View>

      <View className="p-4">
        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <Text className="text-lg leading-[23px] font-black text-textPrimary" numberOfLines={2}>
              {project.project_name}
            </Text>
            <View className="flex-row items-center gap-1 mt-2 mb-3.5">
              <Ionicons name="location-outline" size={14} color={AppColors.accent} />
              <Text className="flex-1 text-[13px] font-semibold text-textSecondary" numberOfLines={1}>
                {location}
              </Text>
            </View>
          </View>

          <View className="w-[34px] h-[34px] rounded-full items-center justify-center bg-tag">
            <Ionicons name="chevron-forward" size={18} color={AppColors.accent} />
          </View>
        </View>

        <View className="flex-row items-center pt-3 border-t border-border">
          <View className="flex-1 flex-row items-center justify-center gap-[5px]">
            <Ionicons name="calendar-outline" size={14} color={AppColors.textSecondary} />
            <Text className="flex-shrink text-xs font-bold text-textSecondary" numberOfLines={1}>
              {completionLabel}
            </Text>
          </View>
          <View className="w-px h-4 mx-2 bg-border" />
          <View className="flex-1 flex-row items-center justify-center gap-[5px]">
            <Ionicons name="home-outline" size={14} color={AppColors.textSecondary} />
            <Text className="text-xs font-bold text-textSecondary">View properties</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(ProjectCard);