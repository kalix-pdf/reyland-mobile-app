import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  message: string;
  onRetry: () => void;
};

export function ErrorScreen({ message, onRetry }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.banner}>
        <Ionicons name="wifi-outline" size={16} color="#A32D2D" />
        <Text style={styles.bannerText}>{message}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Ionicons name="cloud-offline-outline" size={32} color="#A32D2D" />
        </View>
        <Text style={styles.title}>Couldn't connect to the internet :(</Text>
        <Text style={styles.subtitle}>
          Check your connection and try again. The data will appear here once it loads.
        </Text>
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <Ionicons name="refresh-outline" size={16} color={Colors.surface} />
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FCEBEB',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F09595',
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: '#A32D2D',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FCEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.accent,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: Colors.accent,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.surface,
  },
});