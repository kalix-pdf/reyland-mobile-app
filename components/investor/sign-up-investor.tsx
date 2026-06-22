// import { AuthButton } from '@/components/auth/auth-button';
// import { AuthInput } from '@/components/auth/auth-input';
// import { AuthMessage } from '@/components/auth/auth-message';
// import { AuthScreen } from '@/components/auth/auth-screen';
// import { useAppTheme } from '@/context/theme-context';
// import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
// import { createLoginFormStyles } from '../../styles/auth.styles';

// const INVESTOR_TYPES = [
//   'Individual investor',
//   'Corporate / institutional',
//   'Family office',
//   'Real estate developer',
//   'HNWI (High-net-worth)',
// ];

// export function SignUpInvestorForm() {
//   const { colors } = useAppTheme();
//   const styles = createLoginFormStyles(colors);
//   const local = createInvestorSignupStyles(colors);

//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     investorType: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreed, setAgreed] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [typeOpen, setTypeOpen] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState('');

//   const setField = (key: keyof typeof form, value: string) => {
//     setForm((current) => ({ ...current, [key]: value }));
//     setError('');
//   };

//   const firstName = form.firstName.trim();
//   const lastName = form.lastName.trim();
//   const email = form.email.trim();

//   const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword;
//   const canSubmit =
//     firstName.length > 0 && lastName.length > 0 && email.length > 0 && passwordsMatch && agreed;

//   const handleSubmit = async () => {
//     if (loading) return;

//     setSubmitted(true);
//     setError('');

//     if (!firstName || !lastName || !email || !form.password || !form.confirmPassword) {
//       setError('Please complete the required fields.');
//       return;
//     }

//     if (!passwordsMatch) {
//       setError('Passwords do not match.');
//       return;
//     }

//     if (!agreed) {
//       setError('Please accept the terms to continue.');
//       return;
//     }

//     try {
//       setLoading(true);
//       await new Promise((resolve) => setTimeout(resolve, 1200));
//       Alert.alert('Welcome!', 'Your investor account has been created.');
//       router.replace('/');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthScreen heroTitle={`Investor\nSignup`} scrollEnabled>
//       <Text style={styles.title}>Investor Signup</Text>
//       <Text style={styles.subtitleDefault}>
//         Create your investor profile to access Reyland opportunities and portfolio tools.
//       </Text>

//       <AuthMessage type="error" message={error} />

//       <View style={styles.inputAreaDefault}>
//         <View style={local.nameRow}>
//           <View style={local.nameField}>
//             <AuthInput
//               label="First Name"
//               icon={(color) => <Feather name="user" size={20} color={color} />}
//               error={submitted && !firstName ? 'Required.' : ''}
//               placeholder="First name"
//               value={form.firstName}
//               onChangeText={(value) => setField('firstName', value)}
//               autoCapitalize="words"
//               returnKeyType="next"
//               editable={!loading}
//             />
//           </View>

//           <View style={local.nameField}>
//             <AuthInput
//               label="Last Name"
//               icon={(color) => <Feather name="user" size={20} color={color} />}
//               error={submitted && !lastName ? 'Required.' : ''}
//               placeholder="Last name"
//               value={form.lastName}
//               onChangeText={(value) => setField('lastName', value)}
//               autoCapitalize="words"
//               returnKeyType="next"
//               editable={!loading}
//             />
//           </View>
//         </View>

//         <AuthInput
//           label="Email"
//           icon={(color) => <MaterialCommunityIcons name="email-outline" size={20} color={color} />}
//           error={submitted && !email ? 'Email is required.' : ''}
//           placeholder="Enter your email address"
//           value={form.email}
//           onChangeText={(value) => setField('email', value)}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           autoCorrect={false}
//           textContentType="emailAddress"
//           returnKeyType="next"
//           editable={!loading}
//         />

//         <AuthInput
//           label="Mobile Number"
//           icon={(color) => <Feather name="phone" size={20} color={color} />}
//           placeholder="+63 917 000 0000"
//           value={form.phone}
//           onChangeText={(value) => setField('phone', value)}
//           keyboardType="phone-pad"
//           returnKeyType="next"
//           editable={!loading}
//         />

//         <View style={local.pickerContainer}>
//           <Text style={local.pickerLabel}>Investor Type</Text>
//           <Pressable
//             style={({ pressed }) => [local.pickerButton, pressed && local.pressed]}
//             onPress={() => setTypeOpen((current) => !current)}
//             disabled={loading}
//           >
//             <View style={local.pickerIcon}>
//               <Feather name="briefcase" size={20} color={typeOpen ? colors.accent : colors.textMuted} />
//             </View>
//             <Text style={form.investorType ? local.pickerText : local.pickerPlaceholder}>
//               {form.investorType || 'Select your profile'}
//             </Text>
//             <Ionicons name={typeOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
//           </Pressable>

//           {typeOpen ? (
//             <View style={local.dropdown}>
//               {INVESTOR_TYPES.map((type) => (
//                 <Pressable
//                   key={type}
//                   style={({ pressed }) => [
//                     local.dropdownItem,
//                     form.investorType === type && local.dropdownItemActive,
//                     pressed && local.pressed,
//                   ]}
//                   onPress={() => {
//                     setField('investorType', type);
//                     setTypeOpen(false);
//                   }}
//                 >
//                   <Text style={[local.dropdownText, form.investorType === type && local.dropdownTextActive]}>
//                     {type}
//                   </Text>
//                 </Pressable>
//               ))}
//             </View>
//           ) : null}
//         </View>

//         <AuthInput
//           label="Password"
//           icon={(color) => <Feather name="lock" size={20} color={color} />}
//           rightElement={(color) => (
//             <Pressable
//               onPress={() => setShowPassword((current) => !current)}
//               hitSlop={8}
//               style={styles.eyeButton}
//               disabled={loading}
//             >
//               <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={color} />
//             </Pressable>
//           )}
//           error={submitted && !form.password ? 'Password is required.' : ''}
//           placeholder="Password"
//           value={form.password}
//           onChangeText={(value) => setField('password', value)}
//           secureTextEntry={!showPassword}
//           autoCapitalize="none"
//           autoCorrect={false}
//           textContentType="newPassword"
//           returnKeyType="done"
//           onSubmitEditing={handleSubmit}
//           editable={!loading}
//         />

//         <AuthInput
//           label="Confirm Password"
//           icon={(color) => <Feather name="lock" size={20} color={color} />}
//           rightElement={(color) => (
//             <Pressable
//               onPress={() => setShowConfirmPassword((current) => !current)}
//               hitSlop={8}
//               style={styles.eyeButton}
//               disabled={loading}
//             >
//               <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={color} />
//             </Pressable>
//           )}
//           error={
//             submitted && !form.confirmPassword
//               ? 'Confirm your password.'
//               : submitted && form.confirmPassword && !passwordsMatch
//                 ? 'Passwords do not match.'
//                 : ''
//           }
//           placeholder="Confirm password"
//           value={form.confirmPassword}
//           onChangeText={(value) => setField('confirmPassword', value)}
//           secureTextEntry={!showConfirmPassword}
//           autoCapitalize="none"
//           autoCorrect={false}
//           textContentType="newPassword"
//           returnKeyType="done"
//           onSubmitEditing={handleSubmit}
//           editable={!loading}
//         />
//       </View>

//       <Pressable style={local.termsRow} onPress={() => setAgreed((current) => !current)} hitSlop={8}>
//         <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
//           {agreed ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
//         </View>
//         <Text style={local.termsText}>
//           I agree to the <Text style={local.termsLink}>Terms of Service</Text> and{' '}
//           <Text style={local.termsLink}>Privacy Policy</Text>
//         </Text>
//       </Pressable>

//       <View style={styles.buttonWrapTop4}>
//         <AuthButton
//           title="CREATE INVESTOR ACCOUNT"
//           loadingTitle="Creating account..."
//           loading={loading}
//           onPress={handleSubmit}
//           disabled={!canSubmit || loading}
//         />
//       </View>

//       <View style={styles.accountFooterRowSpacious}>
//         <Text style={styles.accountText}>Not ready yet?</Text>
//         <Pressable onPress={() => router.back()} hitSlop={8} disabled={loading}>
//           <Text style={styles.accountLink}> Go Back</Text>
//         </Pressable>
//       </View>
//     </AuthScreen>
//   );
// }

// const createInvestorSignupStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
//   StyleSheet.create({
//     nameRow: {
//       flexDirection: 'row',
//       gap: 12,
//     },
//     nameField: {
//       flex: 1,
//       minWidth: 0,
//     },
//     pickerContainer: {
//       gap: 8,
//     },
//     pickerLabel: {
//       fontSize: 13,
//       fontWeight: '700',
//       color: colors.textPrimary,
//     },
//     pickerButton: {
//       minHeight: 58,
//       borderRadius: 18,
//       borderWidth: 1,
//       borderColor: colors.border,
//       backgroundColor: colors.surface,
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingHorizontal: 16,
//       gap: 12,
//     },
//     pickerIcon: {
//       width: 24,
//       alignItems: 'center',
//     },
//     pickerText: {
//       flex: 1,
//       fontSize: 15,
//       color: colors.textPrimary,
//       fontWeight: '600',
//     },
//     pickerPlaceholder: {
//       flex: 1,
//       fontSize: 15,
//       color: colors.textMuted,
//     },
//     dropdown: {
//       borderRadius: 18,
//       borderWidth: 1,
//       borderColor: colors.border,
//       backgroundColor: colors.surface,
//       overflow: 'hidden',
//     },
//     dropdownItem: {
//       paddingHorizontal: 16,
//       paddingVertical: 13,
//       borderBottomWidth: StyleSheet.hairlineWidth,
//       borderBottomColor: colors.border,
//     },
//     dropdownItemActive: {
//       backgroundColor: colors.tag,
//     },
//     dropdownText: {
//       fontSize: 14,
//       color: colors.textSecondary,
//       fontWeight: '600',
//     },
//     dropdownTextActive: {
//       color: colors.accent,
//       fontWeight: '800',
//     },
//     pressed: {
//       opacity: 0.65,
//     },
//     termsRow: {
//       flexDirection: 'row',
//       alignItems: 'flex-start',
//       gap: 10,
//       marginTop: 4,
//     },
//     termsText: {
//       flex: 1,
//       fontSize: 13,
//       lineHeight: 19,
//       color: colors.textSecondary,
//       fontWeight: '600',
//     },
//     termsLink: {
//       color: colors.accent,
//       fontWeight: '800',
//     },
//   });
