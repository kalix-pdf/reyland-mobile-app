import { Colors } from "@/constants/color";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
};

export default function SettingsRow({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
  danger = false,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, danger && styles.dangerIconWrap]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={[styles.label, danger && styles.dangerLabel]}>
          {label}
        </Text>
      </View>
      <View style={styles.right}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {showArrow && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.tag,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dangerIconWrap: { backgroundColor: "#FEE2E2" },
  icon: { fontSize: 18 },
  label: { fontSize: 15, color: Colors.textPrimary, fontWeight: "500" },
  dangerLabel: { color: Colors.accent },
  right: { flexDirection: "row", alignItems: "center" },
  value: { fontSize: 14, color: Colors.textMuted, marginRight: 6 },
  arrow: { fontSize: 22, color: Colors.textMuted, lineHeight: 24 },
});
