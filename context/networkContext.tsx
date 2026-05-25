// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// type NetworkContextType = {
//   isOnline: boolean;
//   isInternetReachable: boolean | null;
// };

// const NetworkContext = createContext<NetworkContextType>({
//   isOnline: true,
//   isInternetReachable: null,
// });

// export function NetworkProvider({ children }: { children: React.ReactNode }) {
//   const [isOnline, setIsOnline] = useState(true);
//   const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

//   const handleNetworkChange = useCallback((state: NetInfoState) => {
//     setIsOnline(!!state.isConnected);
//     setIsInternetReachable(state.isInternetReachable ?? null);
//   }, []);

//   useEffect(() => {
//     // Fetch initial state
//     NetInfo.fetch().then(handleNetworkChange);

//     // Subscribe to changes
//     const unsubscribe = NetInfo.addEventListener(handleNetworkChange);
//     return unsubscribe;
//   }, [handleNetworkChange]);

//   return (
//     <NetworkContext.Provider value={{ isOnline, isInternetReachable }}>
//       {children}
//     </NetworkContext.Provider>
//   );
// }

// export const useNetwork = () => useContext(NetworkContext);