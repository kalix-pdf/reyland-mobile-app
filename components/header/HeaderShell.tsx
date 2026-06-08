import { useAppTheme } from '@/context/theme-context';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderShellProps {
    children: React.ReactNode;
    withSafeArea?: boolean;
    style?: ViewStyle;
    transparent?: boolean;
}

/**
 * Base shell for every header variant.
 * Owns the background, horizontal padding, bottom border, and optional safe-area top inset.
 * All other header sub-components live inside this.
 */
interface HeaderShellProps {
    children: React.ReactNode;
    withSafeArea?: boolean;
    transparent?: boolean;  // ← add this
    style?: ViewStyle;
}

export function HeaderShell({ children, withSafeArea = false, transparent = false, style }: HeaderShellProps) {
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();

    return (
        <View
            style={[
                styles.shell,
                !transparent && { backgroundColor: colors.surface, borderBottomColor: colors.border },
                !transparent && styles.bordered,
                withSafeArea && { paddingTop: insets.top },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    shell: {
        paddingHorizontal: 20,
        // paddingBottom: 14,
    },
    bordered: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});