import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '../Context/ThemeContext';
import { getToken } from '../services/authStorage';

const API_URL = 'https://holalingo-backend.onrender.com';

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      if (!token) {
        throw new Error('No access token');
      }

      const response = await fetch(`${API_URL}/achievements/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load achievements: ${response.status}`
        );
      }

      const data = await response.json();

      console.log('ACHIEVEMENTS:', data);

      setAchievements(data.achievements || []);
    } catch (error) {
      console.error('Error loading achievements:', error);

      setError('Could not load achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const renderAchievement = ({ item }) => {
    return (
      <View
        style={[
          styles.card,
          !item.unlocked && styles.lockedCard,
        ]}
      >
        <View style={styles.iconContainer}>
          <Text
            style={[
              styles.icon,
              !item.unlocked && styles.lockedIcon,
            ]}
          >
            {item.icon}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>
            {item.name}
          </Text>

          <Text style={styles.description}>
            {item.description}
          </Text>

          {item.unlocked ? (
            <Text style={styles.unlocked}>
              ✓ Unlocked
            </Text>
          ) : (
            <Text style={styles.locked}>
              🔒 Locked
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading achievements...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🏆 Achievements
      </Text>

      <Text style={styles.subtitle}>
        Earn badges as you learn Spanish.
      </Text>

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.code}
        renderItem={renderAchievement}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 25,
    },

    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },

    loadingText: {
      marginTop: 10,
      fontSize: 15,
      color: colors.textSecondary,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.primaryDark,
      marginBottom: 6,
    },

    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 20,
    },

    list: {
      paddingBottom: 30,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 5,

      elevation: 2,
    },

    lockedCard: {
      opacity: 0.6,
    },

    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.yellowSoft,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },

    icon: {
      fontSize: 30,
    },

    lockedIcon: {
      opacity: 0.5,
    },

    content: {
      flex: 1,
    },

    name: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },

    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 7,
    },

    unlocked: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.green,
    },

    locked: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textLight,
    },

    error: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
    },
  });