import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import { useTheme } from '../Context/ThemeContext';
export default function StatCard({
  icon,
  value,
  label,
}) {

  const {colors,isDark,toggleTheme,}=useTheme()
      const styles=createStyles(colors)
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>

      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const createStyles=(colors)=>
  StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  icon: {
    fontSize: 24,
    marginBottom: 8,
  },

  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },

  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
});