import { Href, useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";
import { Property } from "../data/properties";

const { width } = Dimensions.get("window");

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const router = useRouter();

  const formatPrice = (price: number, type: string) => {
    if (price >= 1_000_000) {
      return `₱${(price / 1_000_000).toFixed(1)}M`;
    }
    return `₱${price.toLocaleString()}${type === "For Rent" ? "/mo" : ""}`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/property/[id]", params: { id: property.id } } as unknown as Href)}
      activeOpacity={0.92}
    >
      <Image source={{ uri: property.image[0].image_url }} style={styles.image} />

      <View style={[styles.badge, property.type === "For Rent" ? styles.rentBadge : styles.saleBadge]}>
        <Text style={[styles.badgeText, property.type === "For Rent" ? styles.rentBadgeText : styles.saleBadgeText]}>
          {property.type}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.price}>{formatPrice(property.price, property.type)}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          📍 {property.address}
        </Text>

        <View style={styles.specs}>
          <View style={styles.spec}>
            <Text style={styles.specIcon}>🛏</Text>
            <Text style={styles.specText}>{property.bedrooms} Beds</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.spec}>
            <Text style={styles.specIcon}>🚿</Text>
            <Text style={styles.specText}>{property.bathrooms} Baths</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.spec}>
            <Text style={styles.specIcon}>📐</Text>
            <Text style={styles.specText}>{property.sqft} sqm</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.border,
  },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rentBadge: { backgroundColor: Colors.rentBadge },
  saleBadge: { backgroundColor: Colors.saleBadge },
  badgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  rentBadgeText: { color: Colors.rentBadgeText },
  saleBadgeText: { color: Colors.saleBadgeText },
  content: { padding: 16 },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.accent,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  specs: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  spec: { flexDirection: "row", alignItems: "center", flex: 1 },
  specIcon: { fontSize: 14, marginRight: 4 },
  specText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "600" },
  specDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
});
