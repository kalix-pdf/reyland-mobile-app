// import { Modal, View, Text, Pressable, FlatList } from 'react-native';
// import { Provider, PROVIDERS } from '@/types';

// interface ProviderSelectModalProps {
//   visible: boolean;
//   selected: Provider | null;
//   onSelect: (provider: Provider) => void;
//   onClose: () => void;
// }

// export function ProviderSelectModal({
//   visible,
//   selected,
//   onSelect,
//   onClose,
// }: ProviderSelectModalProps) {
//   const banks = PROVIDERS.filter((p) => p.type === 'bank');
//   const ewallets = PROVIDERS.filter((p) => p.type === 'ewallet');

//   return (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <View className="flex-1 justify-end bg-black/50">
//         <View className="max-h-[70%] rounded-t-2xl bg-neutral-900 px-4 pb-8 pt-4">
//           <View className="mb-4 flex-row items-center justify-between">
//             <Text className="text-lg font-semibold text-white">Select Provider</Text>
//             <Pressable onPress={onClose} hitSlop={10}>
//               <Text className="text-sm text-neutral-400">Close</Text>
//             </Pressable>
//           </View>

//           <FlatList
//             data={[
//               { title: 'Banks', data: banks },
//               { title: 'E-Wallets', data: ewallets },
//             ]}
//             keyExtractor={(section) => section.title}
//             renderItem={({ item: section }) => (
//               <View className="mb-2">
//                 <Text className="mb-2 font-medium uppercase textPrimary">
//                   {section.title}
//                 </Text>
//                 {section.data.map((provider) => {
//                   const isSelected = selected?.id === provider.id;
//                   return (
//                     <Pressable
//                       key={provider.id}
//                       onPress={() => {
//                         onSelect(provider);
//                         onClose();
//                       }}
//                       className={`mb-2 rounded-xl border px-4 py-3 ${
//                         isSelected
//                           ? 'border'
//                           : 'borderDark'
//                       }`}
//                     >
//                       <Text
//                         className={`text-base ${
//                           isSelected ? 'font-semibold textOnDark' : 'textPrimary'
//                         }`}
//                       >
//                         {provider.name}
//                       </Text>
//                     </Pressable>
//                   );
//                 })}
//               </View>
//             )}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// }