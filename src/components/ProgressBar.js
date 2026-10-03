import { StyleSheet, View } from 'react-native';
import colors from '../theme/colors';

export default function ProgressBar({ progress = 0 }) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progress,
          {
            width: `${Math.min(progress, 100)}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#F0E7DC',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
});