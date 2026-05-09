import { Colors } from '@/constants/colors';
import { PROPERTIES } from '@/data/properties';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPropertyDetailStyles } from '../../styles/property.styles';

const { width } = Dimensions.get('window');
const propertyDetailStyles = createPropertyDetailStyles(Colors);
const { modalStyles } = propertyDetailStyles;

function PropertyImages({
  images,
  onClose,
}: {
  images: { image_id: number; public_id: string; image_url: string }[];
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View style={modalStyles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={modalStyles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={modalStyles.counter}>
          {activeIndex + 1} / {images.length}
        </Text>
      </View>

      {/* Horizontal swipeable images */}
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.image_id.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image_url }} style={{ width, height: 400 }} resizeMode="cover" />
        )}
      />

      {/* Dot indicators */}
      <View style={modalStyles.dotsRow}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[modalStyles.dot, i === activeIndex ? modalStyles.dotActive : modalStyles.dotInactive]}
          />
        ))}
      </View>

      {/* Thumbnail strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={modalStyles.thumbnails}>
        {images.map((img, i) => (
          <Image
            key={img.image_id}
            source={{ uri: img.image_url }}
            style={[modalStyles.thumb, i === activeIndex && modalStyles.thumbActive]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function PropertyDetailScreen() {
  const { styles } = propertyDetailStyles;
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const property = PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Property not found.</Text>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number, type: string) => {
    if (price >= 1_000_000) {
      return `₱${(price / 1_000_000).toFixed(2)}M`;
    }
    return `₱${price.toLocaleString()}${type === 'For Rent' ? ' / month' : ''}`;
  };

  const handleCall = () => {
    Linking.openURL(`tel:${property.agent.phone}`);
  };

  const handleInquire = () => {
    Alert.alert('Inquiry Sent!', `Your inquiry for "${property.title}" has been sent to ${property.agent.name}.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Modal visible={openModal} animationType="slide" statusBarTranslucent onRequestClose={() => setOpenModal(false)}>
        <PropertyImages images={property.image} onClose={() => setOpenModal(false)} />
      </Modal>
      <ScrollView
        // alwaysBounceVertical={false} bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: property.image[0].image_url }} style={styles.image} />
          <TouchableOpacity style={styles.viewImagesBtn} onPress={() => setOpenModal(true)}>
            <Text style={styles.viewImagesBtnText}>🖼 View Images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.9}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.badge, property.type === 'For Rent' ? styles.rentBadge : styles.saleBadge]}>
            <Text
              style={[styles.badgeText, property.type === 'For Rent' ? styles.rentBadgeText : styles.saleBadgeText]}
            >
              {property.type}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & Price */}
          <Text style={styles.price}>{formatPrice(property.price, property.type)}</Text>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.address}>📍 {property.address}</Text>

          {/* Specs */}
          <View style={styles.specsRow}>
            {[
              { icon: '🛏', label: `${property.bedrooms} Bedrooms` },
              { icon: '🚿', label: `${property.bathrooms} Bathrooms` },
              { icon: '📐', label: `${property.sqft} sqm` },
            ].map((s) => (
              <View key={s.label} style={styles.specCard}>
                <Text style={styles.specIcon}>{s.icon}</Text>
                <Text style={styles.specLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {property.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About This Property</Text>
          <Text style={styles.description}>{property.description}</Text>

          {/* Agent */}
          <Text style={styles.sectionTitle}>Listed By</Text>
          <View style={styles.agentCard}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentAvatarText}>{property.agent.avatar}</Text>
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{property.agent.name}</Text>
              <Text style={styles.agentPhone}>{property.agent.phone}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Text style={styles.callBtnText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity style={styles.inquireBtn} onPress={handleInquire}>
          <Text style={styles.inquireBtnText}>Send Inquiry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
