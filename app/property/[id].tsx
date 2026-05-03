import { Colors } from "@/constants/colors";
import { PROPERTIES } from "@/data/properties";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

function PropertyImages({images, onClose }: {
  images: { image_id: number; public_id: string; image_url: string }[];
  onClose: () => void; }) 
  {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
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
          <Image
            source={{ uri: item.image_url }}
            style={{ width, height: 400 }}
            resizeMode="cover"
          />
        )}
      />

      {/* Dot indicators */}
      <View style={modalStyles.dotsRow}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              modalStyles.dot,
              i === activeIndex ? modalStyles.dotActive : modalStyles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Thumbnail strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={modalStyles.thumbnails}
      >
        {images.map((img, i) => (
          <Image
            key={img.image_id}
            source={{ uri: img.image_url }}
            style={[
              modalStyles.thumb,
              i === activeIndex && modalStyles.thumbActive,
            ]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function PropertyDetailScreen() {
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
    return `₱${price.toLocaleString()}${type === "For Rent" ? " / month" : ""}`;
  };

  const handleCall = () => {
    Linking.openURL(`tel:${property.agent.phone}`);
  };

  const handleInquire = () => {
    Alert.alert("Inquiry Sent!", `Your inquiry for "${property.title}" has been sent to ${property.agent.name}.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
        <Modal
          visible={openModal}
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setOpenModal(false)}
          >
        <PropertyImages
          images={property.image}
          onClose={() => setOpenModal(false)}
        />
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: property.image[0].image_url }} style={styles.image} />
          <TouchableOpacity style={styles.viewImagesBtn} onPress={() => setOpenModal(true)}>
            <Text style={styles.viewImagesBtnText}>🖼 View Images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.9}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.badge, property.type === "For Rent" ? styles.rentBadge : styles.saleBadge]}>
            <Text
              style={[styles.badgeText, property.type === "For Rent" ? styles.rentBadgeText : styles.saleBadgeText]}
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
              { icon: "🛏", label: `${property.bedrooms} Bedrooms` },
              { icon: "🚿", label: `${property.bathrooms} Bathrooms` },
              { icon: "📐", label: `${property.sqft} sqm` },
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

//modal styles
const modalStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  closeText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  counter: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: "#FFF" },
  dotInactive: { backgroundColor: "rgba(255,255,255,0.35)" },
  thumbnails: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    opacity: 0.5,
  },
  thumbActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: "#FFF",
  }
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  notFound: {
    textAlign: "center",
    marginTop: 80,
    fontSize: 16,
    color: Colors.textMuted,
  },
  imageWrap: { position: "relative" },
  image: { width: "100%", height: 280, backgroundColor: Colors.border },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  rentBadge: { backgroundColor: Colors.rentBadge },
  saleBadge: { backgroundColor: Colors.saleBadge },
  badgeText: { fontSize: 12, fontWeight: "700" },
  rentBadgeText: { color: Colors.rentBadgeText },
  saleBadgeText: { color: Colors.saleBadgeText },
  content: { padding: 20, paddingBottom: 100 },
  price: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.accent,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 26,
  },
  address: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  specsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  specCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  specIcon: { fontSize: 22, marginBottom: 6 },
  specLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  tag: {
    backgroundColor: Colors.tag,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: { fontSize: 12, color: Colors.tagText, fontWeight: "600" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  agentAvatarText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  agentInfo: { flex: 1 },
  agentName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  agentPhone: { fontSize: 13, color: Colors.textSecondary },
  callBtn: {
    backgroundColor: Colors.tag,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  callBtnText: { fontSize: 13, color: Colors.tagText, fontWeight: "700" },
  cta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inquireBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  inquireBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  viewImagesBtn: {                   
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewImagesBtnText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
});
