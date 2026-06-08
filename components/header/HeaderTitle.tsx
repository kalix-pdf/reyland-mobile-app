import { useAppTheme } from '@/context/theme-context';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderTitleProps {
    title: string;
    align?: 'left' | 'center';
}

export function HeaderTitle({ title, align = 'left' }: HeaderTitleProps) {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.background}]}>
            <Text style={[ styles.title, { color: colors.textPrimary }]}
                accessibilityRole="header">
                {title}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
});