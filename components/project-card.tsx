// need to be refactored. Wala pa ito sa API. Just a placeholder for now

// import { Ionicons } from '@expo/vector-icons';
// import { Href, useRouter } from 'expo-router';
// import React from 'react';
// import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Colors } from '../constants/colors';
// import type { Project } from '@/types';
// // const { width } = Dimensions.get('window');

// type Props = {
//   project: Project;
// };

// function ProjectCard({ project }: Props) {
//   const router = useRouter();
//   const location = project.location?.trim() || 'Location unavailable';

//   const formatPrice = (price: number, type: string) => {
//     if (price >= 1_000_000) {
//       return `₱${(price / 1_000_000).toFixed(1)}M`;
//     }
//     return `₱${price.toLocaleString()}${type === 'For Rent' ? '/mo' : ''}`;
//   };

//   return (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => router.push({ pathname: '/property/[id]', params: { id: project.id } } as unknown as Href)}
//       activeOpacity={0.92}
//     >
//       <Image source={{ uri: project.image_url }} style={styles.image} />

//       <View style={[styles.badge, project.location === 'For Rent' ? styles.rentBadge : styles.saleBadge]}>
//         <Text style={[styles.badgeText, project.location === 'For Rent' ? styles.rentBadgeText : styles.saleBadgeText]}>
//           {project.location}
//         </Text>
//       </View>

//       <View style={styles.content}>
//         <Text style={styles.title} numberOfLines={1}>
//           {project.project_name}
//         </Text>
//         <View style={styles.addressRow}>
//           <Ionicons name="location-outline" size={14} color={Colors.accent} />
//           <Text style={styles.address} numberOfLines={1}>
//             {location}
//           </Text>
//         </View>

//         <View style={styles.specs}>
//           <View style={styles.spec}>
//             <Ionicons name="bed-outline" size={14} color={Colors.textSecondary} style={styles.specIcon} />
//             <Text style={styles.specText}>{project.status} Units</Text>
//           </View>
//           <View style={styles.specDivider} />
//           {/* <View style={styles.spec}>
//             <Ionicons name="water-outline" size={14} color={Colors.textSecondary} style={styles.specIcon} />
//             <Text style={styles.specText}>{project.status} </Text>
//           </View> */}
//           <View style={styles.specDivider} />
//           <View style={styles.spec}>
//             <Ionicons name="resize-outline" size={14} color={Colors.textSecondary} style={styles.specIcon} />
//             <Text style={styles.specText}>{project.date_completed} sqm</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// export default React.memo(ProjectCard);

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: Colors.surface,
//     borderRadius: 24,
//     marginHorizontal: 18,
//     marginBottom: 18,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 14,
//     elevation: 4,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     backgroundColor: Colors.border,
//   },
//   badge: {
//     position: 'absolute',
//     top: 14,
//     left: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//   },
//   rentBadge: { backgroundColor: Colors.rentBadge },
//   saleBadge: { backgroundColor: Colors.saleBadge },
//   badgeText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.3 },
//   rentBadgeText: { color: Colors.rentBadgeText },
//   saleBadgeText: { color: Colors.saleBadgeText },
//   content: { padding: 18 },
//   price: {
//     fontSize: 22,
//     fontWeight: '900',
//     color: Colors.accent,
//     marginBottom: 4,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '900',
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   addressRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginBottom: 14,
//   },
//   address: {
//     flex: 1,
//     fontSize: 13,
//     color: Colors.textSecondary,
//     fontWeight: '600',
//   },
//   specs: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 14,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   spec: { flexDirection: 'row', alignItems: 'center', flex: 1 },
//   specIcon: { marginRight: 5 },
//   specText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
//   specDivider: {
//     width: 1,
//     height: 16,
//     backgroundColor: Colors.border,
//     marginHorizontal: 8,
//   },
// });
