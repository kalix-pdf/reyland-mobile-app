import { Colors } from '@/constants/colors';
import { Project, Property, User } from '@/types';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

interface Props {
  projects: Project[];
  user: User | null;
  onPress?: (project: Project) => void;
}

export function FeaturedProjectsScroll({ projects, user, onPress }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-[9px] pb-4 px-4"
    >
      {projects.map((project) => (
        <Shadow
            key={project.id}
            distance={12}
            startColor="rgba(0,0,0,0.10)"
            endColor="rgba(0,0,0,0)"
            offset={[-5, 6]}
            style={{ borderRadius: 24 }}>
          
            <Pressable key={project.id} className="w-[180px] rounded-[18px] bg-white"
              onPress={() => { if (!user) {
                router.push('/welcome');
              } else {
                router.push({
                  pathname: '/project-property/[id]',
                  params: {
                    id: project.id.toString(),
                    name: project.project_name,
                  },
                } as unknown as Href)
              }
              }}>
            <Image
              source={{ uri: project.image_url }}
              style={{ borderRadius: 18, width: '100%', height: 160 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
            <View className="py-[14px] px-[10px] gap-[3px]">
              <Text className="capitalize text-[16px] font-semibold tracking-[-0.8px]" numberOfLines={1}>
                {project.project_name}
              </Text>
              <View className="flex-row items-center gap-[3px]">
                <Ionicons name="location-sharp" size={15} color={Colors.textMuted} />
                <Text className="text-[14px] text-textMuted flex-1" numberOfLines={1}>
                  {project.location}
                </Text>
              </View>
            </View>
          </Pressable>
        </Shadow>
        
      ))}
    </ScrollView>
  );
}

interface FeaturedPropertiesProps {
  properties: Property[];
  user: User | null;
}

const STATUS_LABELS: Record<Property['status'], string> = {
  0: 'Available',
  1: 'Sold',
  2: 'Reserved',
};

function formatPrice(value?: number | null) {
  const price = Number(value ?? 0);

  if (price >= 1_000_000) {
    return `₱${(price / 1_000_000).toFixed(1)}M`;
  }

  return `₱${price.toLocaleString()}`;
}

export function FeaturedPropertiesScroll({ properties, user }: FeaturedPropertiesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-[9px] pb-4 px-4"
    >
      {properties.map((property) => {
        const location = property.project?.location?.trim() || 'Location unavailable';
        const totalPrice = property.total_price ?? Number(property.price ?? 0) * Number(property.area ?? 0);

        return (
          <Shadow
            key={property.id}
            distance={12}
            startColor="rgba(0,0,0,0.10)"
            endColor="rgba(0,0,0,0)"
            offset={[-5, 6]}
            style={{ borderRadius: 24 }}
            >
            
            <Pressable
              key={property.id}
              className="w-[180px] rounded-[18px] bg-white"
            
              onPress={() => { if (!user) {
                router.push('/welcome');
              } else {
                router.push({
                  pathname: '/property/[id]',
                  params: { id: property.id.toString() },
                } as unknown as Href)
              }
            }}>
              <Image
                source={{ uri: property.image_url }}
                style={{ borderRadius: 18, width: '100%', height: 160 }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />
              <View className="absolute top-[10px] left-[10px] px-[10px] py-[5px] rounded-full bg-[#001722]/[0.74]">
                <Text className="text-white text-[11px] font-black">
                  {STATUS_LABELS[property.status] ?? 'Available'}
                </Text>
              </View>
              <View className="py-[14px] px-[10px] gap-[3px]">
                <Text className="text-accent text-[16px] font-black">{formatPrice(totalPrice)}</Text>
                <Text className="capitalize text-[16px] font-semibold tracking-[-0.8px]" numberOfLines={1}>
                  {property.title}
                </Text>
                <View className="flex-row items-center gap-[3px]">
                  <Ionicons name="location-sharp" size={15} color={Colors.textMuted} />
                  <Text className="text-[14px] text-textMuted flex-1" numberOfLines={1}>
                    {location}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Shadow>
        );
      })}
    </ScrollView>
  );
}